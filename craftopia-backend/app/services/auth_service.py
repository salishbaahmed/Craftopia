"""
Authentication Service - Follows Single Responsibility Principle
This service is ONLY responsible for authentication logic
"""
from typing import Optional
from datetime import timedelta
from app.models.user import User
from app.models.admin import Admin
from app.repositories.user_repository import UserRepository
from app.repositories.admin_repository import AdminRepository
from app.utils.password_handler import PasswordHandler
from app.utils.token_handler import TokenHandler
from app.config import settings


class AuthService:
    """
    SRP: Handles ONLY authentication business logic
    DIP: Depends on abstractions (repositories) not concrete implementations
    """
    
    def __init__(
        self,
        user_repository: UserRepository,
        admin_repository: AdminRepository,
        password_handler: PasswordHandler,
        token_handler: TokenHandler
    ):
        self._user_repo = user_repository
        self._admin_repo = admin_repository
        self._password_handler = password_handler
        self._token_handler = token_handler
    
    async def register_user(
        self,
        first_name: str,
        last_name: str,
        email: str,
        password: str
    ) -> dict:
        """Register a new user"""
        # Check if user exists
        existing_user = await self._user_repo.get_by_email(email)
        if existing_user:
            raise ValueError("Email already registered")
        
        # Hash password
        hashed_password = self._password_handler.hash_password(password)
        
        # Create user with correct field names
        user = User(
            first_name=first_name,        # Fixed: snake_case
            last_name=last_name,          # Fixed: snake_case
            email=email,
            password_hash=hashed_password # Fixed: password_hash, not password
        )
        
        # Save to database
        created_user = await self._user_repo.create(user)
        
        # Generate token
        access_token = self._token_handler.create_access_token(
            data={"sub": created_user.email, "role": "user"},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": "user"
        }
    
    async def login(
        self,
        email: str,
        password: str,
        role: str = "user"
    ) -> dict:
        """Authenticate user and return token"""
        # Get user based on role
        if role == "admin":
            user = await self._admin_repo.get_by_email(email)
        else:
            user = await self._user_repo.get_by_email(email)
        
        # Verify credentials
        if not user or not self._password_handler.verify_password(password, user.password_hash):
            raise ValueError("Incorrect email or password")
        
        # Generate token
        access_token = self._token_handler.create_access_token(
            data={"sub": user.email, "role": role},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": role
        }
    
    async def get_current_user(self, token: str) -> Optional[User | Admin]:
        """Get user from JWT token"""
        payload = self._token_handler.decode_token(token)
        email = payload.get("sub")
        role = payload.get("role")
        
        if not email:
            raise ValueError("Invalid token")
        
        # Get user based on role
        if role == "admin":
            return await self._admin_repo.get_by_email(email)
        else:
            return await self._user_repo.get_by_email(email)