"""
Base Repository - Generic CRUD operations
SRP: Handles ONLY basic database operations
OCP: Open for extension (inheritance), closed for modification
"""
from typing import TypeVar, Generic, Optional, List, Type
from sqlmodel import SQLModel, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete as sql_delete

T = TypeVar("T", bound=SQLModel)


class BaseRepository(Generic[T]):
    """
      
    SRP: Responsible ONLY for basic CRUD operations
    """
    
    def __init__(self, session: AsyncSession, model: Type[T]):
        self._session = session
        self._model = model
    
    async def create(self, entity: T) -> T:
        """Create new entity"""
        self._session.add(entity)
        await self._session.commit()
        await self._session.refresh(entity)
        return entity
    
    async def get_by_id(self, entity_id) -> Optional[T]:
        """Get entity by ID - handles both string and int IDs"""
        result = await self._session.execute(
            select(self._model).where(self._model.id == entity_id)
        )
        return result.scalars().first()
    
    async def get_all(self) -> List[T]:
        """Get all entities"""
        result = await self._session.execute(select(self._model))
        return result.scalars().all()
    
    async def update(self, entity: T) -> T:
        """Update entity"""
        self._session.add(entity)
        await self._session.commit()
        await self._session.refresh(entity)
        return entity
    
    async def delete(self, entity_id) -> None:
        """Delete entity by ID"""
        # Use direct SQL delete statement for efficiency
        stmt = sql_delete(self._model).where(self._model.id == entity_id)
        result = await self._session.execute(stmt)
        
        # Check if anything was deleted
        if result.rowcount == 0:
            raise ValueError(f"{self._model.__name__} with id {entity_id} not found")
        
        await self._session.commit()
    
    async def exists(self, entity_id) -> bool:
        """Check if entity exists"""
        result = await self.get_by_id(entity_id)
        return result is not None