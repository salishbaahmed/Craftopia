"""
Analytics Router - Refactored with DI
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from app.services.analytics_service import AnalyticsService
from app.repositories.order_repository import OrderRepository
from app.routers.auth import get_current_admin

router = APIRouter()


# Dependency Injection
def get_analytics_service(
    session: AsyncSession = Depends(get_session)
) -> AnalyticsService:
    """Factory to create AnalyticsService with dependencies"""
    order_repo = OrderRepository(session)
    return AnalyticsService(order_repository=order_repo)


# Routes
@router.get("/sales")
async def get_sales_analytics(
    period: str = "monthly",
    admin=Depends(get_current_admin),
    analytics_service: AnalyticsService = Depends(get_analytics_service)
):
    """
    Get sales analytics grouped by time period
    Query params: period (yearly, monthly, weekly)
    """
    return await analytics_service.get_sales_analytics(period)


@router.get("/summary")
async def get_summary(
    admin=Depends(get_current_admin),
    analytics_service: AnalyticsService = Depends(get_analytics_service)
):
    """Get overall sales summary"""
    return await analytics_service.get_summary()


@router.get("/top-products")
async def get_top_products(
    admin=Depends(get_current_admin),
    analytics_service: AnalyticsService = Depends(get_analytics_service)
):
    """Get top 5 selling products by revenue"""
    return await analytics_service.get_top_products(limit=5)