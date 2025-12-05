"""
Auth Router - Refactored with DI
Uses services instead of direct database access
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
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# DTOs
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


# Dependency Injection
def get_auth_service(session: AsyncSession = Depends(get_session)) -> AuthService:
    """Factory to create AuthService with dependencies"""
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


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Get current user from token"""
    try:
        return await auth_service.get_current_user(token)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_admin(
    token: str = Depends(oauth2_scheme),
    auth_service: AuthService = Depends(get_auth_service)
):
    """Get current admin from token"""
    try:
        return await auth_service.get_current_admin(token)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


# Routes
@router.post("/register", response_model=Token)
async def register(
    user_data: UserCreate,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Register a new user"""
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
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    """Login user and return JWT token"""
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
        raise HTTPException(
            status_code=500,
            detail=f"Login failed: {str(e)}"
        )


@router.get("/me")
async def read_users_me(current_user=Depends(get_current_user)):
    """Get current user profile"""
    return current_user