"""
User Service - Complete Updated Version
File: app/services/user_service.py

SRP: Handles ONLY user profile business logic
"""
from typing import List, Dict, Optional
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
    
    async def get_addresses(self, user: User) -> List[Dict]:
        """Get all user addresses"""
        if not user.addresses:
            return []
        return user.addresses
    
    async def add_address(
        self,
        user: User,
        address_data: Dict
    ) -> List[Dict]:
        """Add new address to user profile"""
        # If this is marked as default or it's the first address, set all others to non-default
        if address_data.get('isDefault', False) or not user.addresses:
            address_data['isDefault'] = True
            if user.addresses:
                for addr in user.addresses:
                    addr['isDefault'] = False
        
        updated_user = await self._user_repo.add_address(user, address_data)
        return updated_user.addresses
    
    async def update_address(
        self,
        user: User,
        address_id: int,
        address_data: Dict
    ) -> List[Dict]:
        """Update an existing address"""
        if not user.addresses:
            raise ValueError("No addresses found")
        
        # Find the address by index (address_id - 1 since frontend uses 1-based indexing)
        address_index = address_id - 1
        
        if address_index < 0 or address_index >= len(user.addresses):
            raise ValueError(f"Address with id {address_id} not found")
        
        # If setting this as default, unset all others
        if address_data.get('isDefault', False):
            for i, addr in enumerate(user.addresses):
                if i != address_index:
                    addr['isDefault'] = False
        
        # Update the address
        user.addresses[address_index] = address_data
        
        updated_user = await self._user_repo.update_addresses(user, user.addresses)
        return updated_user.addresses
    
    async def delete_address(
        self,
        user: User,
        address_id: int
    ) -> List[Dict]:
        """Delete an address"""
        if not user.addresses:
            raise ValueError("No addresses found")
        
        address_index = address_id - 1
        
        if address_index < 0 or address_index >= len(user.addresses):
            raise ValueError(f"Address with id {address_id} not found")
        
        # Check if trying to delete the default address
        was_default = user.addresses[address_index].get('isDefault', False)
        
        # Remove the address
        user.addresses.pop(address_index)
        
        # If we deleted the default address and there are remaining addresses,
        # make the first one default
        if was_default and user.addresses:
            user.addresses[0]['isDefault'] = True
        
        updated_user = await self._user_repo.update_addresses(user, user.addresses)
        return updated_user.addresses
    
    async def set_default_address(
        self,
        user: User,
        address_id: int
    ) -> List[Dict]:
        """Set an address as the default address"""
        if not user.addresses:
            raise ValueError("No addresses found")
        
        address_index = address_id - 1
        
        if address_index < 0 or address_index >= len(user.addresses):
            raise ValueError(f"Address with id {address_id} not found")
        
        # Set all addresses to non-default
        for addr in user.addresses:
            addr['isDefault'] = False
        
        # Set the selected address as default
        user.addresses[address_index]['isDefault'] = True
        
        updated_user = await self._user_repo.update_addresses(user, user.addresses)
        return updated_user.addresses