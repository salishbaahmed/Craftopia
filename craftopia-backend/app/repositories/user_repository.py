""" 
File: app/repositories/user_repository.py

SRP: Handles ONLY User-specific database operations
"""
from typing import Optional, List, Dict
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
    
    async def update_profile(
        self,
        user: User,
        first_name: str,
        last_name: str,
        phone: str
    ) -> User:
        """Update user profile information"""
        user.first_name = first_name
        user.last_name = last_name
        user.phone_number = phone
        
        self._session.add(user)
        await self._session.commit()
        await self._session.refresh(user)
        
        return user
    
    async def add_address(
        self,
        user: User,
        address_data: Dict
    ) -> User:
        """Add a new address to user's address list"""
        if not user.addresses:
            user.addresses = []
        
        user.addresses.append(address_data)
        
        self._session.add(user)
        await self._session.commit()
        await self._session.refresh(user)
        
        return user
    
    async def update_addresses(
        self,
        user: User,
        addresses: List[Dict]
    ) -> User:
        """Update the entire addresses list"""
        user.addresses = addresses
        
        self._session.add(user)
        await self._session.commit()
        await self._session.refresh(user)
        
        return user