"""
Orders Router
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional

from app.models.user import User
from app.models.admin import Admin
from app.models.order import OrderItem
from app.services.order_service import OrderService
from app.dependencies import get_order_service, get_current_user, get_current_admin, get_current_user_or_admin
from app.repositories.user_repository import UserRepository
from app.database import get_session
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/api/orders", tags=["orders"])


# Serialization helper - converts backend Order to frontend-friendly format
async def serialize_order_for_frontend(order, session: AsyncSession) -> dict:
    """Serialize order with user information for frontend"""
    # Get user information
    user_repo = UserRepository(session)
    user = await user_repo.get_by_id(order.userId)
    
    customer_name = "Customer"
    customer_email = ""
    if user:
        customer_name = f"{getattr(user, 'first_name', getattr(user, 'firstName', 'Customer'))} {getattr(user, 'last_name', getattr(user, 'lastName', ''))}"
        customer_email = user.email
    
    return {
        # IDs
        "id": order.id,
        "orderId": order.id,
        "userId": order.userId,
        
        # Customer info (frontend expects these)
        "customerName": customer_name,
        "customerEmail": customer_email,
        "customerPhone": order.shippingAddress.get("phone", "") if isinstance(order.shippingAddress, dict) else "",
        
        # Items
        "items": [
            {
                "id": item.id,
                "orderId": getattr(item, 'order_id', None),
                "productId": item.productId,
                "name": item.name,
                "price": float(item.price),
                "quantity": item.quantity,
                "image": getattr(item, 'image', None),
                "imageUrl": getattr(item, 'image', None),
            }
            for item in (order.items or [])
        ],
        "orderItems": [
            {
                "id": item.id,
                "productId": item.productId,
                "name": item.name,
                "price": float(item.price),
                "quantity": item.quantity,
            }
            for item in (order.items or [])
        ],
        
        # Address
        "shippingAddress": order.shippingAddress,
        "checkoutFormData": {
            "fullName": customer_name,
            "email": customer_email,
            **(order.shippingAddress if isinstance(order.shippingAddress, dict) else {})
        },
        
        # Amounts
        "subtotal": float(order.subtotal),
        "discount": float(order.discount),
        "tax": float(order.tax),
        "total": float(order.total),
        "totalAmount": float(order.total),
        "totalPrice": float(order.total),
        "totalPaid": float(order.total),
        
        # Status
        "status": order.status.lower(),
        "orderStatus": order.status.lower(),
        "paymentStatus": order.paymentStatus,
        "deliveryStatus": order.deliveryStatus.lower() if order.deliveryStatus else order.status.lower(),
        
        # Delivery info
        "deliveryHistory": order.deliveryHistory or [],
        "estimatedDelivery": order.estimatedDelivery,
        "deliveryDate": order.deliveryDate,
        
        # Dates (frontend expects string format)
        "createdAt": order.createdAt.isoformat() if order.createdAt else None,
        "orderDate": order.createdAt.strftime("%Y-%m-%d") if order.createdAt else None,
        "orderPlaced": order.createdAt.isoformat() if order.createdAt else None,
        
        # Payment
        "paymentMethod": "Cash on Delivery",
        "payment": "Cash on Delivery",
    }


# Request Models
class OrderItemRequest(BaseModel):
    productId: str
    name: str
    price: float
    quantity: int
    imageUrl: str


class ShippingAddress(BaseModel):
    street: str
    city: str
    state: str
    zipCode: str
    country: str
    phone: Optional[str] = None


class CreateOrderRequest(BaseModel):
    items: List[OrderItemRequest]
    shippingAddress: ShippingAddress
    subtotal: float
    discount: float
    tax: float
    total: float
    paymentStatus: str = "Pending"


class UpdateStatusRequest(BaseModel):
    status: str


class UpdateDeliveryRequest(BaseModel):
    deliveryStatus: str
    deliveryHistory: Optional[List[dict]] = None
    estimatedDelivery: Optional[str] = None
    deliveryDate: Optional[str] = None


# User endpoints
@router.post("/")
@router.post("")
async def create_order(
    order_data: CreateOrderRequest,
    current_user: User = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service),
    session: AsyncSession = Depends(get_session)
):
    """Create new order (user only)"""
    try:
        items = [
            OrderItem(
                productId=item.productId,
                name=item.name,
                price=item.price,
                quantity=item.quantity,
                image=item.imageUrl
            ) 
            for item in order_data.items
        ]
        
        order = await order_service.create_order(
            user=current_user,
            items=items,
            shipping_address=order_data.shippingAddress.dict(),
            subtotal=order_data.subtotal,
            discount=order_data.discount,
            tax=order_data.tax,
            total=order_data.total,
            payment_status=order_data.paymentStatus
        )
        
        return await serialize_order_for_frontend(order, session)
    except Exception as e:
        print(f"[ERROR] create_order: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/")
@router.get("")
async def get_orders(
    current_user: User = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service),
    session: AsyncSession = Depends(get_session)
):
    """Get all orders for current user"""
    orders = await order_service.get_user_orders(current_user.id)
    print(f"[DEBUG] Found {len(orders)} orders for user {current_user.id}")
    return [await serialize_order_for_frontend(order, session) for order in orders]


# Admin endpoints
@router.get("/admin/all/")
@router.get("/admin/all")
async def get_all_orders_admin(
    current_admin: Admin = Depends(get_current_admin),
    order_service: OrderService = Depends(get_order_service),
    session: AsyncSession = Depends(get_session)
):
    """Get all orders (admin only)"""
    print(f"[DEBUG] Admin {current_admin.email} requesting all orders")
    orders = await order_service.get_all_orders()
    print(f"[DEBUG] Found {len(orders)} total orders")
    serialized = [await serialize_order_for_frontend(order, session) for order in orders]
    print(f"[DEBUG] Returning {len(serialized)} serialized orders")
    return serialized


@router.get("/{order_id}/")
@router.get("/{order_id}")
async def get_order(
    order_id: str,
    current_user: User | Admin = Depends(get_current_user_or_admin),
    order_service: OrderService = Depends(get_order_service),
    session: AsyncSession = Depends(get_session)
):
    """Get order by ID"""
    try:
        order = await order_service.get_order_by_id(order_id, current_user)
        return await serialize_order_for_frontend(order, session)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.patch("/admin/{order_id}/status/")
@router.patch("/admin/{order_id}/status")
@router.put("/{order_id}/status/")
@router.put("/{order_id}/status")
async def update_order_status(
    order_id: str,
    status_data: UpdateStatusRequest,
    current_admin: Admin = Depends(get_current_admin),
    order_service: OrderService = Depends(get_order_service),
    session: AsyncSession = Depends(get_session)
):
    """Update order status (admin only)"""
    try:
        order = await order_service.update_order_status(order_id, status_data.status)
        return await serialize_order_for_frontend(order, session)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.patch("/admin/{order_id}/delivery-status/")
@router.patch("/admin/{order_id}/delivery-status")
@router.put("/{order_id}/delivery/")
@router.put("/{order_id}/delivery")
@router.patch("/{order_id}/delivery/")
@router.patch("/{order_id}/delivery")
async def update_delivery_status(
    order_id: str,
    delivery_data: UpdateDeliveryRequest,
    current_admin: Admin = Depends(get_current_admin),
    order_service: OrderService = Depends(get_order_service),
    session: AsyncSession = Depends(get_session)
):
    """Update delivery status (admin only)"""
    try:
        order = await order_service.update_delivery_status(
            order_id=order_id,
            delivery_status=delivery_data.deliveryStatus,
            delivery_history=delivery_data.deliveryHistory,
            estimated_delivery=delivery_data.estimatedDelivery,
            delivery_date=delivery_data.deliveryDate
        )
        return await serialize_order_for_frontend(order, session)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{order_id}/invoice/")
@router.get("/{order_id}/invoice")
async def get_invoice(
    order_id: str,
    current_user: User | Admin = Depends(get_current_user_or_admin),
    order_service: OrderService = Depends(get_order_service)
):
    """Generate and download invoice PDF"""
    try:
        pdf_buffer = await order_service.generate_invoice(order_id, current_user)
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=invoice_{order_id}.pdf"
            }
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))