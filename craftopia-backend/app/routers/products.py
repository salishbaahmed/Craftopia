from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from beanie import PydanticObjectId
from app.models.product import Product
from app.utils.auth import get_current_admin
from pydantic import BaseModel

router = APIRouter()

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

@router.get("/", response_model=List[Product])
async def get_products():
    return await Product.find_all().to_list()

@router.get("/{id}", response_model=Product)
async def get_product(id: PydanticObjectId):
    product = await Product.get(id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=Product, status_code=201)
async def create_product(product: Product, admin = Depends(get_current_admin)):
    await product.create()
    return product

@router.put("/{id}", response_model=Product)
async def update_product(id: PydanticObjectId, product_update: ProductUpdate, admin = Depends(get_current_admin)):
    product = await Product.get(id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_update.dict(exclude_unset=True)
    await product.set(update_data)
    return product

@router.delete("/{id}", status_code=204)
async def delete_product(id: PydanticObjectId, admin = Depends(get_current_admin)):
    product = await Product.get(id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    await product.delete()
    return None
