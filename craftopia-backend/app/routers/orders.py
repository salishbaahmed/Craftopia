"""
Orders Router - Refactored with DI
"""
from fastapi import APIRouter, HTTPException, Depends, Body
from fastapi.responses import StreamingResponse
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from app.models.order import (
    Order, OrderItem, OrderCreate,
    OrderItemCreate, OrderResponse
)
from app.models.user import User
from app.services.order_service import OrderService
from app.repositories.order_repository import OrderRepository
from app.utils.invoice_generator import InvoiceGenerator
from app.routers.auth import get_current_user, get_current_admin

router = APIRouter()


# Dependency Injection
def get_order_service(
    session: AsyncSession = Depends(get_session)
) -> OrderService:
    """Factory to create OrderService with dependencies"""
    order_repo = OrderRepository(session)
    invoice_gen = InvoiceGenerator()
    return OrderService(
        order_repository=order_repo,
        invoice_generator=invoice_gen
    )


# Routes
@router.post("/", response_model=Order, status_code=201)
async def create_order(
    order_data: OrderCreate,
    user: User = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """Create new order"""
    try:
        # Convert OrderItemCreate to OrderItem
        items = [
            OrderItem(**item_data.dict())
            for item_data in order_data.items
        ]
        
        order = await order_service.create_order(
            user=user,
            items=items,
            shipping_address=order_data.shippingAddress,
            subtotal=order_data.subtotal,
            discount=order_data.discount,
            tax=order_data.tax,
            total=order_data.total,
            payment_status=order_data.paymentStatus
        )
        return order
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/my-orders", response_model=List[OrderResponse])
async def get_my_orders(
    user: User = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """Get all orders for current user"""
    return await order_service.get_user_orders(user.id)


@router.get("/{id}", response_model=Order)
async def get_order(
    id: str,
    user: User = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """Get order by ID"""
    try:
        return await order_service.get_order_by_id(id, user)
    except ValueError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=403, detail=str(e))


@router.get("/{id}/invoice")
async def download_invoice(
    id: str,
    user: User = Depends(get_current_user),
    order_service: OrderService = Depends(get_order_service)
):
    """Download order invoice PDF"""
    try:
        pdf_buffer = await order_service.generate_invoice(id, user)
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=invoice_{id}.pdf"
            }
        )
    except ValueError as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=403, detail=str(e))


# Admin Routes
@router.get("/admin/all", response_model=List[Order])
async def get_all_orders(
    admin=Depends(get_current_admin),
    order_service: OrderService = Depends(get_order_service)
):
    """Get all orders (admin only)"""
    return await order_service.get_all_orders()


@router.patch("/admin/{id}/status", response_model=Order)
async def update_order_status(
    id: str,
    status: str = Body(..., embed=True),
    admin=Depends(get_current_admin),
    order_service: OrderService = Depends(get_order_service)
):
    """Update order status (admin only)"""
    try:
        return await order_service.update_order_status(id, status)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.patch("/admin/{id}/delivery-status", response_model=Order)
async def update_delivery_status(
    id: str,
    deliveryStatus: str = Body(..., embed=True),
    deliveryHistory: List[dict] = Body(default=[], embed=True),
    estimatedDelivery: Optional[str] = Body(default=None, embed=True),
    deliveryDate: Optional[str] = Body(default=None, embed=True),
    admin=Depends(get_current_admin),
    order_service: OrderService = Depends(get_order_service)
):
    """Update order delivery status (admin only)"""
    try:
        return await order_service.update_delivery_status(
            order_id=id,
            delivery_status=deliveryStatus,
            delivery_history=deliveryHistory,
            estimated_delivery=estimatedDelivery,
            delivery_date=deliveryDate
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))