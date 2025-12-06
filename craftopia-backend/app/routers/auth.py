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
from app.models.admin import Admin
from app.models.user import User
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
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

class UserInfo(BaseModel):
    id: str
    email: str
    firstName: str
    lastName: str
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

# Support both with and without trailing slash
@router.post("/register", response_model=Token)
@router.post("/register/", response_model=Token)
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
@router.post("/login/", response_model=Token)
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.get("/me", response_model=UserInfo)
@router.get("/me/", response_model=UserInfo)
async def get_current_user_info(
    auth_service: AuthService = Depends(get_auth_service),
    credentials = Depends(oauth2_scheme)
):
    """
    Get current user information from token
    Works for both users and admins
    """
    try:
        token = credentials
        user = await auth_service.get_current_user(token)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Determine role based on model type
        role = "admin" if isinstance(user, Admin) else "user"
        
        # Return user info without password
        return {
            "id": user.id,
            "email": user.email,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "role": role
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] /me endpoint: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )