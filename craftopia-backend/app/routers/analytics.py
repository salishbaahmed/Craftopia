from fastapi import APIRouter, Depends
from app.utils.auth import get_current_admin
from app.models.order import Order
from app.models.product import Product
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/sales")
async def get_sales_analytics(period: str = "monthly", admin = Depends(get_current_admin)):
    # Basic aggregation logic - in production use MongoDB aggregation pipeline
    orders = await Order.find_all().to_list()
    
    # This is a simplified example. Real implementation should use aggregate()
    data = {}
    for order in orders:
        date_key = order.createdAt.strftime("%Y-%m") if period == "monthly" else order.createdAt.strftime("%Y-%W")
        if date_key not in data:
            data[date_key] = {"revenue": 0, "orders": 0}
        data[date_key]["revenue"] += order.total
        data[date_key]["orders"] += 1
        
    return [{"period": k, **v} for k, v in data.items()]

@router.get("/summary")
async def get_summary(admin = Depends(get_current_admin)):
    orders = await Order.find_all().to_list()
    total_revenue = sum(o.total for o in orders)
    total_orders = len(orders)
    avg_order_value = total_revenue / total_orders if total_orders > 0 else 0
    
    return {
        "totalRevenue": total_revenue,
        "totalOrders": total_orders,
        "averageOrderValue": avg_order_value
    }

@router.get("/top-products")
async def get_top_products(admin = Depends(get_current_admin)):
    # Simplified top products
    orders = await Order.find_all().to_list()
    product_sales = {}
    
    for order in orders:
        for item in order.items:
            pid = str(item.productId)
            if pid not in product_sales:
                product_sales[pid] = {"name": item.name, "sales": 0, "revenue": 0}
            product_sales[pid]["sales"] += item.quantity
            product_sales[pid]["revenue"] += item.price * item.quantity
            
    sorted_products = sorted(product_sales.values(), key=lambda x: x["revenue"], reverse=True)
    return sorted_products[:5]
