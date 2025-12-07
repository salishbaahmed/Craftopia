"""
Product Service - Follows Single Responsibility Principle
This service is ONLY responsible for product business logic
"""
from typing import List, Optional
from app.models.product import Product
from app.repositories.product_repository import ProductRepository


class ProductService:
    """
    SRP: Handles ONLY product business logic
    DIP: Depends on ProductRepository abstraction
    """
    
    def __init__(self, product_repository: ProductRepository):
        self._product_repo = product_repository
    
    async def get_all_products(self) -> List[Product]:
        """Get all products"""
        return await self._product_repo.get_all()
    
    async def get_product_by_id(self, product_id: str) -> Product:
        """Get product by ID"""
        product = await self._product_repo.get_by_id(product_id)
        if not product:
            raise ValueError(f"Product with id {product_id} not found")
        return product
    
    async def get_products_by_category(self, category: str) -> List[Product]:
        """Get products by category"""
        return await self._product_repo.get_by_category(category)
    
    async def search_products(self, name: str) -> List[Product]:
        """Search products by name"""
        return await self._product_repo.search_by_name(name)
    
    async def create_product(self, product: Product) -> Product:
        """Create a new product"""
        return await self._product_repo.create(product)
    
    async def update_product(self, product_id: str, update_data: dict) -> Product:
        """Update product"""
        # Check if product exists
        product = await self._product_repo.get_by_id(product_id)
        if not product:
            raise ValueError(f"Product with id {product_id} not found")
        
        # Update product fields
        for key, value in update_data.items():
            if hasattr(product, key):
                setattr(product, key, value)
        
        return await self._product_repo.update(product)
    
    async def delete_product(self, product_id: str) -> None:
        """
        Delete a product
        IMPORTANT: Pass the product_id (string), not the Product object
        """
        # Check if product exists
        product = await self._product_repo.get_by_id(product_id)
        if not product:
            raise ValueError(f"Product with id {product_id} not found")
        
        # Delete by ID (string), not by object
        await self._product_repo.delete(product_id)