"""
Admin Repository - Extends Base Repository
SRP: Handles ONLY Admin-specific database operations
"""
from typing import Optional
from sqlmodel import select
from app.models.admin import Admin
from app.repositories.base_repository import BaseRepository


class AdminRepository(BaseRepository[Admin]):
    """
    Concrete implementation for Admin data access
    SRP: Responsible ONLY for Admin database operations
    """
    
    def __init__(self, session):
        super().__init__(session, Admin)
    
    async def get_by_email(self, email: str) -> Optional[Admin]:
        """Get admin by email"""
        result = await self._session.execute(
            select(Admin).where(Admin.email == email)
        )
        return result.scalars().first()