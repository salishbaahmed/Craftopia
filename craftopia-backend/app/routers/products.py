from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from app.models.product import Product
from app.utils.auth import get_current_admin
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from app.database import get_session
from sqlmodel import select
from app.services.product_service import ProductService

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
async def get_products(session: AsyncSession = Depends(get_session)):
    service = ProductService()
    return await service.get_all_products(session)

@router.get("/{id}", response_model=Product)
async def get_product(id: str, session: AsyncSession = Depends(get_session)):
    product = await session.get(Product, id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=Product, status_code=201)
async def create_product(product: Product, admin = Depends(get_current_admin), session: AsyncSession = Depends(get_session)):
    service = ProductService()
    return await service.create_product(product, session)

@router.put("/{id}", response_model=Product)
async def update_product(id: str, product_update: ProductUpdate, admin = Depends(get_current_admin), session: AsyncSession = Depends(get_session)):
    product = await session.get(Product, id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
        
    session.add(product)
    await session.commit()
    await session.refresh(product)
    return product

@router.delete("/{id}", status_code=204)
async def delete_product(id: str, admin = Depends(get_current_admin), session: AsyncSession = Depends(get_session)):
    product = await session.get(Product, id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    await session.delete(product)
    await session.commit()
    return None
