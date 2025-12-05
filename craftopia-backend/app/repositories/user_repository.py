"""
User Repository - Extends Base Repository
SRP: Handles ONLY User-specific database operations
"""
from typing import Optional
from sqlmodel import select
from app.models.user import User
from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    """
    Concrete implementation for User data access
    SRP: Responsible ONLY for User database operations
    """
    
    def __init__(self, session):
        super().__init__(session, User)
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        result = await self._session.execute(
            select(User).where(User.email == email)
        )
        return result.scalars().first()
    
    async def email_exists(self, email: str) -> bool:
        """Check if email already exists"""
        user = await self.get_by_email(email)
        return user is not None