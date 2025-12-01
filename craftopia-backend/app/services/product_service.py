from app.services.base_service import BaseProductService
from app.models.product import Product
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from typing import List

class ProductService(BaseProductService):
    """
    Concrete implementation of Product Service.
    Handles business logic and database interactions.
    Demonstrates Single Responsibility Principle (SRP) and Encapsulation.
    """
    async def get_all_products(self, session: AsyncSession) -> List[Product]:
        result = await session.execute(select(Product))
        return result.scalars().all()

    async def create_product(self, product: Product, session: AsyncSession) -> Product:
        session.add(product)
        await session.commit()
        await session.refresh(product)
        return product
