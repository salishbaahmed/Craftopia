from abc import ABC, abstractmethod
from app.models.product import Product
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

class BaseProductService(ABC):
    """
    Abstract Base Class for Product Service.
    Defines the interface for product operations.
    Demonstrates Abstraction and Open/Closed Principle.
    """
    @abstractmethod
    async def get_all_products(self, session: AsyncSession) -> List[Product]:
        pass

    @abstractmethod
    async def create_product(self, product: Product, session: AsyncSession) -> Product:
        pass
