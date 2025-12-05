"""
Analytics Service
SRP: Handles ONLY analytics business logic
"""
from typing import List, Dict
from app.repositories.order_repository import OrderRepository


class AnalyticsService:
    """
    Analytics business logic
    SRP: Single responsibility - handle analytics calculations
    DIP: Depends on injected repository
    """
    
    def __init__(self, order_repository: OrderRepository):
        self._order_repo = order_repository
    
    async def get_sales_analytics(self, period: str = "monthly") -> List[Dict]:
        """
        Get sales analytics grouped by time period
        Supports: yearly, monthly, weekly
        """
        orders = await self._order_repo.get_all_with_items()
        
        data = {}
        for order in orders:
            # Determine date key based on period
            if period == "yearly":
                date_key = order.createdAt.strftime("%Y")
            elif period == "monthly":
                date_key = order.createdAt.strftime("%Y-%m")
            else:  # weekly
                date_key = order.createdAt.strftime("%Y-%W")
            
            # Initialize period data if not exists
            if date_key not in data:
                data[date_key] = {
                    "revenue": 0,
                    "orders": 0,
                    "delivered": 0
                }
            
            # Aggregate data
            data[date_key]["revenue"] += order.total
            data[date_key]["orders"] += 1
            
            # Count delivered orders
            if self._is_delivered(order):
                data[date_key]["delivered"] += 1
        
        # Convert to list format
        return [{"period": k, **v} for k, v in data.items()]
    
    async def get_summary(self) -> Dict:
        """Get overall sales summary"""
        orders = await self._order_repo.get_all_with_items()
        
        total_revenue = sum(o.total for o in orders)
        total_orders = len(orders)
        total_delivered = sum(1 for o in orders if self._is_delivered(o))
        avg_order_value = total_revenue / total_orders if total_orders > 0 else 0
        
        return {
            "totalRevenue": total_revenue,
            "totalOrders": total_orders,
            "totalDelivered": total_delivered,
            "averageOrderValue": avg_order_value
        }
    
    async def get_top_products(self, limit: int = 5) -> List[Dict]:
        """Get top selling products by revenue"""
        orders = await self._order_repo.get_all_with_items()
        
        product_sales = {}
        
        for order in orders:
            for item in order.items:
                pid = str(item.productId)
                
                if pid not in product_sales:
                    product_sales[pid] = {
                        "id": pid,
                        "name": item.name,
                        "sales": 0,
                        "revenue": 0
                    }
                
                product_sales[pid]["sales"] += item.quantity
                product_sales[pid]["revenue"] += item.price * item.quantity
        
        # Sort by revenue and return top N
        sorted_products = sorted(
            product_sales.values(),
            key=lambda x: x["revenue"],
            reverse=True
        )
        
        return sorted_products[:limit]
    
    def _is_delivered(self, order) -> bool:
        """Helper method to check if order is delivered"""
        status = order.status.lower()
        delivery_status = getattr(order, 'deliveryStatus', '').lower()
        return status == 'delivered' or delivery_status == 'delivered'