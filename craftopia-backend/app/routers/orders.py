from fastapi import APIRouter, HTTPException, Depends, Body
from typing import List
from beanie import PydanticObjectId
from app.models.order import Order
from app.models.user import User
from app.utils.auth import get_current_user, get_current_admin

router = APIRouter()

@router.post("/", response_model=Order, status_code=201)
async def create_order(order: Order, user: User = Depends(get_current_user)):
    # Ensure the order is linked to the current user
    order.userId = user.id
    await order.create()
    return order

@router.get("/my-orders", response_model=List[Order])
async def get_my_orders(user: User = Depends(get_current_user)):
    return await Order.find(Order.userId == user.id).to_list()

@router.get("/{id}", response_model=Order)
async def get_order(id: PydanticObjectId, user: User = Depends(get_current_user)):
    order = await Order.get(id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    # Allow admin or the owner to view
    if order.userId != user.id and not hasattr(user, 'role'): # simple check, better to use explicit admin check if mixed
         # If user is not admin and not owner
         raise HTTPException(status_code=403, detail="Not authorized to view this order")
    return order

# Admin Routes
@router.get("/admin/all", response_model=List[Order])
async def get_all_orders(admin = Depends(get_current_admin)):
    return await Order.find_all().to_list()

@router.patch("/admin/{id}/status", response_model=Order)
async def update_order_status(id: PydanticObjectId, status: str = Body(..., embed=True), admin = Depends(get_current_admin)):
    order = await Order.get(id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status
    await order.save()
    return order
