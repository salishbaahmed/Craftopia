"""
Product Service
SRP: Handles ONLY product business logic
"""
from typing import List, Optional
from app.models.product import Product
from app.repositories.product_repository import ProductRepository


class ProductService:
    """
    Product business logic
    SRP: Single responsibility - handle product operations
    DIP: Depends on injected repository
    """
    
    def __init__(self, product_repository: ProductRepository):
        self._product_repo = product_repository
    
    async def get_all_products(self) -> List[Product]:
        """Get all products"""
        return await self._product_repo.get_all()
    
    async def get_product_by_id(self, product_id: str) -> Optional[Product]:
        """Get product by ID"""
        product = await self._product_repo.get_by_id(product_id)
        if not product:
            raise ValueError("Product not found")
        return product
    
    async def create_product(self, product: Product) -> Product:
        """Create new product"""
        return await self._product_repo.create(product)
    
    async def update_product(
        self,
        product_id: str,
        update_data: dict
    ) -> Product:
        """Update product information"""
        product = await self.get_product_by_id(product_id)
        
        # Update fields
        for key, value in update_data.items():
            if hasattr(product, key):
                setattr(product, key, value)
        
        return await self._product_repo.update(product)
    
    async def delete_product(self, product_id: str) -> None:
        """Delete product"""
        product = await self.get_product_by_id(product_id)
        await self._product_repo.delete(product)
    
    async def get_products_by_category(self, category: str) -> List[Product]:
        """Get all products in a category"""
        return await self._product_repo.get_by_category(category)
    
    async def search_products(self, name: str) -> List[Product]:
        """Search products by name"""
        return await self._product_repo.search_by_name(name)
    
    async def get_in_stock_products(self) -> List[Product]:
        """Get all products that are in stock"""
        return await self._product_repo.get_in_stock()
    
    async def get_limited_editions(self) -> List[Product]:
        """Get all limited edition products"""
        return await self._product_repo.get_limited_editions()
    
    async def update_stock(
        self,
        product_id: str,
        quantity: int
    ) -> Product:
        """Update product stock"""
        product = await self.get_product_by_id(product_id)
        return await self._product_repo.update_stock(product, quantity)