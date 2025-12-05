#app/router/products.py 
"""
Products Router - Refactored with DI
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from app.models.product import Product
from app.services.product_service import ProductService
from app.repositories.product_repository import ProductRepository
from app.routers.auth import get_current_admin

router = APIRouter()


# DTOs
class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    stock: Optional[int] = None
    images: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    materials: Optional[str] = None
    dimensions: Optional[str] = None
    weight: Optional[float] = None
    careInstructions: Optional[str] = None
    artistStory: Optional[str] = None
    limitedEdition: Optional[bool] = None


# Dependency Injection
def get_product_service(
    session: AsyncSession = Depends(get_session)
) -> ProductService:
    """Factory to create ProductService with dependencies"""
    product_repo = ProductRepository(session)
    return ProductService(product_repository=product_repo)


# Routes
@router.get("/", response_model=List[Product])
async def get_products(
    product_service: ProductService = Depends(get_product_service)
):
    """Get all products"""
    return await product_service.get_all_products()


@router.get("/{id}", response_model=Product)
async def get_product(
    id: str,
    product_service: ProductService = Depends(get_product_service)
):
    """Get product by ID"""
    try:
        return await product_service.get_product_by_id(id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/", response_model=Product, status_code=201)
async def create_product(
    product: Product,
    admin=Depends(get_current_admin),
    product_service: ProductService = Depends(get_product_service)
):
    """Create new product (admin only)"""
    try:
        return await product_service.create_product(product)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{id}", response_model=Product)
async def update_product(
    id: str,
    product_update: ProductUpdate,
    admin=Depends(get_current_admin),
    product_service: ProductService = Depends(get_product_service)
):
    """Update product (admin only)"""
    try:
        update_data = product_update.dict(exclude_unset=True)
        return await product_service.update_product(id, update_data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{id}", status_code=204)
async def delete_product(
    id: str,
    admin=Depends(get_current_admin),
    product_service: ProductService = Depends(get_product_service)
):
    """Delete product (admin only)"""
    try:
        await product_service.delete_product(id)
        return None
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))