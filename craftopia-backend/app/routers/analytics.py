"""
Analytics Router
"""
from fastapi import APIRouter, Depends, Query

from app.models.admin import Admin
from app.services.analytics_service import AnalyticsService
from app.dependencies import get_analytics_service, get_current_admin

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/summary")
async def get_summary(
    current_admin: Admin = Depends(get_current_admin),
    analytics_service: AnalyticsService = Depends(get_analytics_service)
):
    """Get overall sales summary (admin only)"""
    return await analytics_service.get_summary()


@router.get("/sales")
async def get_sales_analytics(
    period: str = Query("monthly", regex="^(yearly|monthly|weekly)$"),
    current_admin: Admin = Depends(get_current_admin),
    analytics_service: AnalyticsService = Depends(get_analytics_service)
):
    """Get sales analytics by period (admin only)"""
    return await analytics_service.get_sales_analytics(period)


@router.get("/top-products")
async def get_top_products(
    limit: int = Query(5, ge=1, le=20),
    current_admin: Admin = Depends(get_current_admin),
    analytics_service: AnalyticsService = Depends(get_analytics_service)
):
    """Get top selling products (admin only)"""
    return await analytics_service.get_top_products(limit)