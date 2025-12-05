"""
User Service
SRP: Handles ONLY user profile business logic
"""
from typing import List
from app.models.user import User, Address
from app.repositories.user_repository import UserRepository


class UserService:
    """
    User profile business logic
    SRP: Single responsibility - handle user operations
    DIP: Depends on injected repository
    """
    
    def __init__(self, user_repository: UserRepository):
        self._user_repo = user_repository
    
    async def get_profile(self, user: User) -> User:
        """Get user profile"""
        return user
    
    async def update_profile(
        self,
        user: User,
        first_name: str,
        last_name: str,
        phone: str
    ) -> User:
        """Update user profile information"""
        return await self._user_repo.update_profile(
            user=user,
            first_name=first_name,
            last_name=last_name,
            phone=phone
        )
    
    async def get_addresses(self, user: User) -> List[dict]:
        """Get all user addresses"""
        return user.addresses or []
    
    async def add_address(
        self,
        user: User,
        address: Address
    ) -> List[dict]:
        """Add new address to user profile"""
        address_dict = address.dict()
        updated_user = await self._user_repo.add_address(user, address_dict)
        return updated_user.addresses