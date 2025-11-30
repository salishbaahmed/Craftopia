import asyncio
from app.database import init_db, get_session
from app.models.order import Order, OrderItem
from app.models.user import User
from sqlmodel import select

async def reproduce_issue():
    print("Initializing database...")
    await init_db()
    
    # Mock user
    user = User(firstName="Test", lastName="User", email="test_order@example.com", password="password")
    
    # Mock order data as it comes from Pydantic (nested objects)
    # BUT, if the input to the endpoint is just a dict or if Pydantic validation is bypassed/weird, it might be dicts.
    # The error suggests dicts are being passed to the relationship.
    
    # Let's simulate what happens in the endpoint:
    # async def create_order(order: Order, ...):
    #     session.add(order)
    
    # If we construct Order manually with dicts in items, it should fail.
    try:
        print("Attempting to create order with dict items...")
        items_data = [
            {"productId": "123", "name": "Test Product", "price": 100, "quantity": 1}
        ]
        # This is what might be happening if Pydantic parses 'items' as a list of dicts 
        # instead of converting them to OrderItem objects because of some configuration or issue.
        # However, Pydantic *should* convert them.
        
        # Let's try to simulate the exact object structure that causes the error.
        # If I pass a list of dicts to the 'items' field of Order constructor:
        # Simulate the new logic in the endpoint
        from app.models.order import OrderCreate, OrderItemCreate
        
        # Input data (dicts)
        items_data = [
            {"productId": "123", "name": "Test Product", "price": 100, "quantity": 1}
        ]
        
        # Pydantic validation (this is what FastAPI does)
        order_create = OrderCreate(
            items=items_data,
            shippingAddress={},
            subtotal=100,
            discount=0,
            tax=0,
            total=100
        )
        print("OrderCreate validation successful")
        
        # Manual conversion (this is what the endpoint does)
        order_dict = order_create.dict(exclude={"items"})
        order = Order(**order_dict)
        order.userId = user.id
        
        order_items = []
        for item_data in order_create.items:
            item = OrderItem(**item_data.dict())
            order_items.append(item)
        
        order.items = order_items
        
        print(f"Order items type: {type(order.items)}")
        print(f"First item type: {type(order.items[0])}")
        
        async for session in get_session():
            session.add(order)
            await session.commit()
            print(f"Order saved successfully: {order.id}")
            
            # Verify invoice generation
            print("Verifying invoice generation...")
            from app.utils.invoice_generator import generate_invoice_pdf
            
            # We need to load items for invoice generation
            # In the actual endpoint, we do this with selectinload
            # Here, since we just added them to session and refreshed, they might be available or need loading
            # But let's try generating.
            try:
                pdf_buffer = generate_invoice_pdf(order)
                print(f"Invoice generated successfully. Size: {len(pdf_buffer.getvalue())} bytes")
            except Exception as e:
                print(f"Error generating invoice: {e}")
                import traceback
                traceback.print_exc()
            
            # Clean up
            await session.delete(order)
            await session.commit()
            
    except Exception as e:
        print(f"Caught expected error: {e}")
        # import traceback
        # traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(reproduce_issue())
