"""
Shared dependencies for dependency injection
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.database import get_session
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.services.product_service import ProductService
from app.services.order_service import OrderService
from app.services.analytics_service import AnalyticsService
from app.repositories.user_repository import UserRepository
from app.repositories.admin_repository import AdminRepository
from app.repositories.product_repository import ProductRepository
from app.repositories.order_repository import OrderRepository
from app.utils.password_handler import PasswordHandler
from app.utils.token_handler import TokenHandler
from app.utils.invoice_generator import InvoiceGenerator
from app.models.user import User
from app.models.admin import Admin

# Security scheme
security = HTTPBearer()


# Service Factories
def get_auth_service(session: AsyncSession = Depends(get_session)) -> AuthService:
    """Create AuthService with dependencies"""
    user_repo = UserRepository(session)
    admin_repo = AdminRepository(session)
    password_handler = PasswordHandler()
    token_handler = TokenHandler()
    
    return AuthService(
        user_repository=user_repo,
        admin_repository=admin_repo,
        password_handler=password_handler,
        token_handler=token_handler
    )


def get_user_service(session: AsyncSession = Depends(get_session)) -> UserService:
    """Create UserService with dependencies"""
    user_repo = UserRepository(session)
    return UserService(user_repository=user_repo)


def get_product_service(session: AsyncSession = Depends(get_session)) -> ProductService:
    """Create ProductService with dependencies"""
    product_repo = ProductRepository(session)
    return ProductService(product_repository=product_repo)


def get_order_service(session: AsyncSession = Depends(get_session)) -> OrderService:
    """Create OrderService with dependencies"""
    order_repo = OrderRepository(session)
    invoice_gen = InvoiceGenerator()
    return OrderService(
        order_repository=order_repo,
        invoice_generator=invoice_gen
    )


def get_analytics_service(session: AsyncSession = Depends(get_session)) -> AnalyticsService:
    """Create AnalyticsService with dependencies"""
    order_repo = OrderRepository(session)
    return AnalyticsService(order_repository=order_repo)


# Authentication Dependencies
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
) -> User:
    """
    Get current authenticated user from token
    Raises 401 if token is invalid or user not found
    """
    try:
        token = credentials.credentials
        user = await auth_service.get_current_user(token)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Make sure it's a User, not Admin
        if isinstance(user, Admin):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access not allowed on this endpoint"
            )
        
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
) -> Admin:
    """
    Get current authenticated admin from token
    Raises 401 if token is invalid or 403 if not admin
    """
    try:
        token = credentials.credentials
        user = await auth_service.get_current_user(token)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Make sure it's an Admin, not regular User
        if not isinstance(user, Admin):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
        
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user_or_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
) -> User | Admin:
    """
    Get current authenticated user or admin from token
    Accepts both user and admin tokens
    """
    try:
        token = credentials.credentials
        user = await auth_service.get_current_user(token)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )