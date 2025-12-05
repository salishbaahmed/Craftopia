"""
Order Service
SRP: Handles ONLY order business logic
"""
from typing import List, Optional
from app.models.order import Order, OrderItem
from app.models.user import User
from app.repositories.order_repository import OrderRepository
from app.utils.invoice_generator import InvoiceGenerator
import io


class OrderService:
    """
    Order business logic
    SRP: Single responsibility - handle order operations
    DIP: Depends on injected repository
    """
    
    def __init__(
        self,
        order_repository: OrderRepository,
        invoice_generator: InvoiceGenerator
    ):
        self._order_repo = order_repository
        self._invoice_generator = invoice_generator
    
    async def create_order(
        self,
        user: User,
        items: List[OrderItem],
        shipping_address: dict,
        subtotal: float,
        discount: float,
        tax: float,
        total: float,
        payment_status: str = "Pending"
    ) -> Order:
        """Create new order for user"""
        order = Order(
            userId=user.id,
            shippingAddress=shipping_address,
            subtotal=subtotal,
            discount=discount,
            tax=tax,
            total=total,
            paymentStatus=payment_status
        )
        
        return await self._order_repo.create_with_items(order, items)
    
    async def get_user_orders(self, user_id: str) -> List[Order]:
        """Get all orders for a user"""
        return await self._order_repo.get_by_user_id(user_id)
    
    async def get_order_by_id(
        self,
        order_id: str,
        user: User
    ) -> Order:
        """
        Get order by ID
        Validates that user owns the order or is admin
        """
        order = await self._order_repo.get_by_id_with_items(order_id)
        
        if not order:
            raise ValueError("Order not found")
        
        # Check authorization (allow owner or admin)
        if order.userId != user.id:
            user_role = getattr(user, "role", "user")
            if user_role != "admin":
                raise ValueError("Not authorized to view this order")
        
        return order
    
    async def generate_invoice(
        self,
        order_id: str,
        user: User
    ) -> io.BytesIO:
        """Generate invoice PDF for order"""
        order = await self.get_order_by_id(order_id, user)
        return self._invoice_generator.generate_pdf(order)
    
    async def get_all_orders(self) -> List[Order]:
        """Get all orders (admin only)"""
        return await self._order_repo.get_all_with_items()
    
    async def update_order_status(
        self,
        order_id: str,
        status: str
    ) -> Order:
        """Update order status (admin only)"""
        order = await self._order_repo.get_by_id_with_items(order_id)
        
        if not order:
            raise ValueError("Order not found")
        
        return await self._order_repo.update_status(order, status)
    
    async def update_delivery_status(
        self,
        order_id: str,
        delivery_status: str,
        delivery_history: Optional[List[dict]] = None,
        estimated_delivery: Optional[str] = None,
        delivery_date: Optional[str] = None
    ) -> Order:
        """Update order delivery information (admin only)"""
        order = await self._order_repo.get_by_id_with_items(order_id)
        
        if not order:
            raise ValueError("Order not found")
        
        return await self._order_repo.update_delivery_status(
            order=order,
            delivery_status=delivery_status,
            delivery_history=delivery_history or [],
            estimated_delivery=estimated_delivery,
            delivery_date=delivery_date
        )