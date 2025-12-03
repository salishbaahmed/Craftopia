from fastapi import APIRouter, Depends
from app.utils.auth import get_current_admin
from app.models.order import Order
from app.models.product import Product
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from sqlmodel import select
from sqlalchemy.orm import selectinload

router = APIRouter()

@router.get("/sales")
async def get_sales_analytics(period: str = "monthly", admin = Depends(get_current_admin), session: AsyncSession = Depends(get_session)):
    # Basic aggregation logic
    result = await session.execute(select(Order))
    orders = result.scalars().all()
    
    data = {}
    for order in orders:
        if period == "yearly":
            date_key = order.createdAt.strftime("%Y")
        elif period == "monthly":
            date_key = order.createdAt.strftime("%Y-%m")
        else: # weekly
            date_key = order.createdAt.strftime("%Y-%W")
            
        if date_key not in data:
            data[date_key] = {"revenue": 0, "orders": 0, "delivered": 0}
            
        data[date_key]["revenue"] += order.total
        data[date_key]["orders"] += 1
        
        # Check delivery status
        status = order.status.lower()
        delivery_status = getattr(order, 'deliveryStatus', '').lower()
        if status == 'delivered' or delivery_status == 'delivered':
            data[date_key]["delivered"] += 1
        
    return [{"period": k, **v} for k, v in data.items()]

@router.get("/summary")
async def get_summary(admin = Depends(get_current_admin), session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Order))
    orders = result.scalars().all()
    
    total_revenue = sum(o.total for o in orders)
    total_orders = len(orders)
    
    total_delivered = 0
    for o in orders:
        status = o.status.lower()
        delivery_status = getattr(o, 'deliveryStatus', '').lower()
        if status == 'delivered' or delivery_status == 'delivered':
            total_delivered += 1
            
    avg_order_value = total_revenue / total_orders if total_orders > 0 else 0
    
    return {
        "totalRevenue": total_revenue,
        "totalOrders": total_orders,
        "totalDelivered": total_delivered,
        "averageOrderValue": avg_order_value
    }

@router.get("/top-products")
async def get_top_products(admin = Depends(get_current_admin), session: AsyncSession = Depends(get_session)):
    # Simplified top products
    # We need to load items for orders
    result = await session.execute(select(Order).options(selectinload(Order.items)))
    orders = result.scalars().all()
    
    product_sales = {}
    
    for order in orders:
        for item in order.items:
            pid = str(item.productId)
            if pid not in product_sales:
                product_sales[pid] = {"id": pid, "name": item.name, "sales": 0, "revenue": 0}
            product_sales[pid]["sales"] += item.quantity
            product_sales[pid]["revenue"] += item.price * item.quantity
            
    sorted_products = sorted(product_sales.values(), key=lambda x: x["revenue"], reverse=True)
    return sorted_products[:5]
