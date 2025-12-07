"""
Products Router
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.models.product import Product
from app.models.admin import Admin
from app.services.product_service import ProductService
from app.dependencies import get_product_service, get_current_admin

router = APIRouter(prefix="/api/products", tags=["products"])

# Request Models
class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    stock: int
    images: List[str] = []
    tags: List[str] = []
    materials: Optional[str] = None
    dimensions: Optional[str] = None
    weight: Optional[float] = None
    careInstructions: Optional[str] = None
    artistStory: Optional[str] = None
    limitedEdition: bool = False

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

# GET all products - support both with and without trailing slash
@router.get("/")
@router.get("")
async def get_all_products(
    product_service: ProductService = Depends(get_product_service)
):
    """Get all products (public)"""
    return await product_service.get_all_products()

@router.get("/{product_id}/")
@router.get("/{product_id}")
async def get_product(
    product_id: str,
    product_service: ProductService = Depends(get_product_service)
):
    """Get product by ID (public)"""
    try:
        product = await product_service.get_product_by_id(product_id)
        return product
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/category/{category}")
async def get_products_by_category(
    category: str,
    product_service: ProductService = Depends(get_product_service)
):
    """Get products by category (public)"""
    return await product_service.get_products_by_category(category)

@router.get("/search/{name}")
async def search_products(
    name: str,
    product_service: ProductService = Depends(get_product_service)
):
    """Search products by name (public)"""
    return await product_service.search_products(name)

# POST create product - support both with and without trailing slash
@router.post("/")
@router.post("")
async def create_product(
    product_data: ProductCreate,
    current_admin: Admin = Depends(get_current_admin),
    product_service: ProductService = Depends(get_product_service)
):
    """Create new product (admin only)"""
    try:
        product = Product(**product_data.dict())
        created_product = await product_service.create_product(product)
        return created_product
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{product_id}/")
@router.put("/{product_id}")
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    current_admin: Admin = Depends(get_current_admin),
    product_service: ProductService = Depends(get_product_service)
):
    """Update product (admin only)"""
    try:
        update_dict = product_data.dict(exclude_unset=True)
        updated_product = await product_service.update_product(product_id, update_dict)
        return updated_product
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{product_id}/")
@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    current_admin: Admin = Depends(get_current_admin),
    product_service: ProductService = Depends(get_product_service)
):
    """Delete product (admin only)"""
    try:
        await product_service.delete_product(product_id)
        return {"message": "Product deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))