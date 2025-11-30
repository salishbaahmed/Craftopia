from fastapi import APIRouter, HTTPException, Depends, Body
from typing import List
from app.models.order import Order, OrderItem
from app.models.user import User
from app.utils.auth import get_current_user, get_current_admin
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from sqlmodel import select
from sqlalchemy.orm import selectinload

router = APIRouter()

@router.post("/", response_model=Order, status_code=201)
async def create_order(order: Order, user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    # Ensure the order is linked to the current user
    order.userId = user.id
    
    # We need to handle items separately if they are passed in the order object but not linked yet
    # But Order model has items: List[OrderItem]
    # If the input JSON has items, Pydantic/SQLModel will try to parse them.
    # However, we need to ensure they are created correctly.
    
    # Actually, if we just add the order to the session, SQLModel should handle the relationship if configured correctly.
    # But `items` in `Order` is a relationship. If the input `Order` Pydantic model has `items` as a list of `OrderItem` objects,
    # we might need to adjust how we handle it because `OrderItem` needs `order_id` which isn't generated yet.
    # SQLAlchemy handles this by flushing.
    
    session.add(order)
    await session.commit()
    await session.refresh(order)
    
    # We might need to refresh items too to get their IDs if needed, but for response it might be fine.
    # To return items, we need to load them.
    # await session.refresh(order, ["items"]) # This might not work directly with asyncpg in all versions without explicit load
    
    # Let's re-fetch with items
    result = await session.execute(select(Order).where(Order.id == order.id).options(selectinload(Order.items)))
    order = result.scalars().first()
    
    return order

@router.get("/my-orders", response_model=List[Order])
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
