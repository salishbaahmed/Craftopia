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

router = APIRouter(prefix="/api/orders", tags=["orders"])


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


# User endpoints - support both with and without trailing slash
@router.post("/")
@router.post("")
async def create_order(
    order_data: CreateOrderRequest,
    current_user: User = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """Create new order (user only)"""
    try:
        items = [OrderItem(**item.dict()) for item in order_data.items]
        
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
        return order
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/")
@router.get("")
async def get_orders(
    current_user: User = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """Get all orders for current user"""
    return await order_service.get_user_orders(current_user.id)


# Admin endpoints - support both with and without trailing slash
@router.get("/admin/all/")
@router.get("/admin/all")
async def get_all_orders_admin(
    current_admin: Admin = Depends(get_current_admin),
    order_service: OrderService = Depends(get_order_service)
):
    """Get all orders (admin only)"""
    return await order_service.get_all_orders()


@router.get("/{order_id}")
async def get_order(
    order_id: str,
    current_user: User | Admin = Depends(get_current_user_or_admin),
    order_service: OrderService = Depends(get_order_service)
):
    """Get order by ID"""
    try:
        order = await order_service.get_order_by_id(order_id, current_user)
        return order
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{order_id}/status/")
@router.put("/{order_id}/status")
async def update_order_status(
    order_id: str,
    status_data: UpdateStatusRequest,
    current_admin: Admin = Depends(get_current_admin),
    order_service: OrderService = Depends(get_order_service)
):
    """Update order status (admin only)"""
    try:
        order = await order_service.update_order_status(order_id, status_data.status)
        return order
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{order_id}/delivery/")
@router.put("/{order_id}/delivery")
async def update_delivery_status(
    order_id: str,
    delivery_data: UpdateDeliveryRequest,
    current_admin: Admin = Depends(get_current_admin),
    order_service: OrderService = Depends(get_order_service)
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
        return order
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