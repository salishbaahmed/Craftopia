"""
Product Repository
SRP: Handles ONLY Product database operations
"""
from typing import List, Optional
from sqlmodel import select
from app.models.product import Product
from app.repositories.base_repository import BaseRepository


class ProductRepository(BaseRepository[Product]):
    """
    Product data access layer
    SRP: Responsible ONLY for Product database operations
    """
    
    def __init__(self, session):
        super().__init__(session, Product)
    
    async def get_by_category(self, category: str) -> List[Product]:
        """Get all products in a specific category"""
        result = await self._session.execute(
            select(Product).where(Product.category == category)
        )
        return result.scalars().all()
    
    async def search_by_name(self, name: str) -> List[Product]:
        """Search products by name (case-insensitive)"""
        result = await self._session.execute(
            select(Product).where(Product.name.ilike(f"%{name}%"))
        )
        return result.scalars().all()
    
    async def get_in_stock(self) -> List[Product]:
        """Get all products that are in stock"""
        result = await self._session.execute(
            select(Product).where(Product.stock > 0)
        )
        return result.scalars().all()
    
    async def update_stock(self, product: Product, quantity: int) -> Product:
        """Update product stock quantity"""
        product.stock = quantity
        return await self.update(product)
    
    async def get_limited_editions(self) -> List[Product]:
        """Get all limited edition products"""
        result = await self._session.execute(
            select(Product).where(Product.limitedEdition == True)
        )
        return result.scalars().all()