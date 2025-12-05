"""
Order Repository
SRP: Handles ONLY Order database operations
"""
from typing import List, Optional
from sqlmodel import select
from sqlalchemy.orm import selectinload
from app.models.order import Order, OrderItem
from app.repositories.base_repository import BaseRepository


class OrderRepository(BaseRepository[Order]):
    """
    Order data access layer
    SRP: Responsible ONLY for Order database operations
    """
    
    def __init__(self, session):
        super().__init__(session, Order)
    
    async def get_by_user_id(self, user_id: str) -> List[Order]:
        """Get all orders for a specific user"""
        result = await self._session.execute(
            select(Order)
            .where(Order.userId == user_id)
            .options(selectinload(Order.items))
        )
        return result.scalars().all()
    
    async def get_by_id_with_items(self, order_id: str) -> Optional[Order]:
        """Get order by ID with items loaded"""
        result = await self._session.execute(
            select(Order)
            .where(Order.id == order_id)
            .options(selectinload(Order.items))
        )
        return result.scalars().first()
    
    async def get_all_with_items(self) -> List[Order]:
        """Get all orders with items loaded"""
        result = await self._session.execute(
            select(Order).options(selectinload(Order.items))
        )
        return result.scalars().all()
    
    async def create_with_items(
        self,
        order: Order,
        items: List[OrderItem]
    ) -> Order:
        """Create order with its items"""
        order.items = items
        self._session.add(order)
        await self._session.commit()
        await self._session.refresh(order)
        
        # Reload with items
        return await self.get_by_id_with_items(order.id)
    
    async def update_status(
        self,
        order: Order,
        status: str
    ) -> Order:
        """Update order status"""
        order.status = status
        return await self.update(order)
    
    async def update_delivery_status(
        self,
        order: Order,
        delivery_status: str,
        delivery_history: Optional[List[dict]] = None,
        estimated_delivery: Optional[str] = None,
        delivery_date: Optional[str] = None
    ) -> Order:
        """Update order delivery information"""
        order.deliveryStatus = delivery_status
        
        if delivery_history is not None:
            order.deliveryHistory = delivery_history
        if estimated_delivery is not None:
            order.estimatedDelivery = estimated_delivery
        if delivery_date is not None:
            order.deliveryDate = delivery_date
        
        # Sync main status with delivery status
        status_mapping = {
            'delivered': 'delivered',
            'shipped': 'shipped',
            'out-for-delivery': 'out-for-delivery',
            'processing': 'processing'
        }
        if delivery_status in status_mapping:
            order.status = status_mapping[delivery_status]
        
        return await self.update(order)
    
    async def get_by_status(self, status: str) -> List[Order]:
        """Get all orders with a specific status"""
        result = await self._session.execute(
            select(Order)
            .where(Order.status == status)
            .options(selectinload(Order.items))
        )
        return result.scalars().all()