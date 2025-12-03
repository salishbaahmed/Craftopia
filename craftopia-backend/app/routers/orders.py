from fastapi import APIRouter, HTTPException, Depends, Body
from fastapi.responses import StreamingResponse
from app.utils.invoice_generator import generate_invoice_pdf
from typing import List, Optional
from app.models.order import Order, OrderItem, OrderCreate, OrderItemCreate, OrderResponse
from app.models.user import User
from app.utils.auth import get_current_user, get_current_admin
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from sqlmodel import select
from sqlalchemy.orm import selectinload

router = APIRouter()

@router.post("/", response_model=Order, status_code=201)
async def create_order(order_data: OrderCreate, user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    # Convert OrderCreate to Order
    # We need to manually create OrderItems from OrderItemCreate
    
    # Create Order object (excluding items for now)
    order_dict = order_data.dict(exclude={"items"})
    order = Order(**order_dict)
    order.userId = user.id
    
    # Create OrderItem objects
    order_items = []
    for item_data in order_data.items:
        item = OrderItem(**item_data.dict())
        # We don't need to set order_id explicitly if we add to order.items, 
        # but let's be safe and let SQLAlchemy handle the relationship
        order_items.append(item)
    
    order.items = order_items
    
    session.add(order)
    await session.commit()
    await session.refresh(order)
    
    # Re-fetch with items to ensure response is correct
    result = await session.execute(select(Order).where(Order.id == order.id).options(selectinload(Order.items)))
    order = result.scalars().first()
    
    return order

@router.get("/my-orders", response_model=List[OrderResponse])
async def get_my_orders(user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Order).where(Order.userId == user.id).options(selectinload(Order.items)))
    return result.scalars().all()

@router.get("/{id}", response_model=Order)
async def get_order(id: str, user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Order).where(Order.id == id).options(selectinload(Order.items)))
    order = result.scalars().first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    # Allow admin or the owner to view
    if order.userId != user.id:
        # Check if user is admin (this logic was a bit loose in original, assuming 'role' attr or separate admin check)
        # In our get_current_user, we return Admin object if found. Admin model has role="admin".
        if getattr(user, "role", "user") != "admin":
             raise HTTPException(status_code=403, detail="Not authorized to view this order")
    return order

@router.get("/{id}/invoice")
async def download_invoice(id: str, user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Order).where(Order.id == id).options(selectinload(Order.items)))
    order = result.scalars().first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if order.userId != user.id:
        if getattr(user, "role", "user") != "admin":
             raise HTTPException(status_code=403, detail="Not authorized to view this invoice")
             
    pdf_buffer = generate_invoice_pdf(order)
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=invoice_{order.id}.pdf"}
    )

# Admin Routes
@router.get("/admin/all", response_model=List[Order])
async def get_all_orders(admin = Depends(get_current_admin), session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Order).options(selectinload(Order.items)))
    return result.scalars().all()

@router.patch("/admin/{id}/status", response_model=Order)
async def update_order_status(id: str, status: str = Body(..., embed=True), admin = Depends(get_current_admin), session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Order).where(Order.id == id).options(selectinload(Order.items)))
    order = result.scalars().first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status
    session.add(order)
    await session.commit()
    await session.refresh(order)
    return order

@router.patch("/admin/{id}/delivery-status", response_model=Order)
async def update_delivery_status(
    id: str, 
    deliveryStatus: str = Body(..., embed=True),
    deliveryHistory: List[dict] = Body(default=[], embed=True),
    estimatedDelivery: Optional[str] = Body(default=None, embed=True),
    deliveryDate: Optional[str] = Body(default=None, embed=True),
    admin = Depends(get_current_admin), 
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(select(Order).where(Order.id == id).options(selectinload(Order.items)))
    order = result.scalars().first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.deliveryStatus = deliveryStatus
    if deliveryHistory:
        order.deliveryHistory = deliveryHistory
    if estimatedDelivery is not None:
        order.estimatedDelivery = estimatedDelivery
    if deliveryDate is not None:
        order.deliveryDate = deliveryDate
        
    # Also update main status if applicable
    # If delivery status is 'delivered', set main status to 'delivered'
    if deliveryStatus == 'delivered':
        order.status = 'delivered'
    elif deliveryStatus == 'shipped':
        order.status = 'shipped'
    elif deliveryStatus == 'out-for-delivery':
        order.status = 'out-for-delivery'
    elif deliveryStatus == 'processing':
        order.status = 'processing'
        
    session.add(order)
    await session.commit()
    await session.refresh(order)
    return order
