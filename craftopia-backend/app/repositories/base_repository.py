"""
Base Repository - Follows Single Responsibility Principle
SRP: Handles ONLY database operations
DIP: Abstract interface that concrete repositories implement
"""
from abc import ABC, abstractmethod
from typing import TypeVar, Generic, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

T = TypeVar('T')


class BaseRepository(ABC, Generic[T]):
    """
    Abstract base repository
    SRP: Responsible ONLY for database CRUD operations
    DIP: Provides abstraction for data access layer
    """
    
    def __init__(self, session: AsyncSession, model_class: type[T]):
        self._session = session
        self._model_class = model_class
    
    async def get_by_id(self, id: str) -> Optional[T]:
        """Get entity by ID"""
        result = await self._session.execute(
            select(self._model_class).where(self._model_class.id == id)
        )
        return result.scalars().first()
    
    async def get_all(self) -> List[T]:
        """Get all entities"""
        result = await self._session.execute(select(self._model_class))
        return result.scalars().all()
    
    async def create(self, entity: T) -> T:
        """Create new entity"""
        self._session.add(entity)
        await self._session.commit()
        await self._session.refresh(entity)
        return entity
    
    async def update(self, entity: T) -> T:
        """Update existing entity"""
        self._session.add(entity)
        await self._session.commit()
        await self._session.refresh(entity)
        return entity
    
    async def delete(self, id: str) -> bool:
        """Delete entity by ID"""
        entity = await self.get_by_id(id)
        if entity:
            await self._session.delete(entity)
            await self._session.commit()
            return True
        return False