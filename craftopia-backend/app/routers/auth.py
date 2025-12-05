"""
Refactored Auth Router using OOP and SOLID principles
"""
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository
from app.repositories.admin_repository import AdminRepository
from app.utils.password_handler import PasswordHandler
from app.utils.token_handler import TokenHandler

router = APIRouter(prefix="/api/auth", tags=["auth"])


# DTOs (Data Transfer Objects)
class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: str = "user"


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str


# Dependency Injection - DIP in action
def get_auth_service(session: AsyncSession = Depends(get_session)) -> AuthService:
    """
    Dependency Injection factory
    DIP: High-level modules (router) depend on abstractions (AuthService)
    """
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


@router.post("/register", response_model=Token)
async def register(
    user_data: UserCreate,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Register a new user
    Uses dependency injection to get AuthService
    """
    try:
        result = await auth_service.register_user(
            first_name=user_data.firstName,
            last_name=user_data.lastName,
            email=user_data.email,
            password=user_data.password
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Login user and return JWT token
    Uses dependency injection to get AuthService
    """
    try:
        result = await auth_service.login(
            email=login_data.email,
            password=login_data.password,
            role=login_data.role
        )
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


@router.get("/me")
async def read_users_me(
    token: str = Depends(lambda: "token_from_header"),  # Replace with actual OAuth2 scheme
    auth_service: AuthService = Depends(get_auth_service)
):
    """Get current user from token"""
    try:
        user = await auth_service.get_current_user(token)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )