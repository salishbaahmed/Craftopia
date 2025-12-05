"""
Users Router - Refactored with DI
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from app.models.user import User, Address
from app.services.user_service import UserService
from app.repositories.user_repository import UserRepository
from app.routers.auth import get_current_user

router = APIRouter()


# DTOs
class UserProfileUpdate(BaseModel):
    firstName: str
    lastName: str
    phone: str


# Dependency Injection
def get_user_service(session: AsyncSession = Depends(get_session)) -> UserService:
    """Factory to create UserService with dependencies"""
    user_repo = UserRepository(session)
    return UserService(user_repository=user_repo)


# Routes
@router.get("/profile", response_model=User)
async def get_profile(
    user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Get user profile"""
    return await user_service.get_profile(user)


@router.put("/profile", response_model=User)
async def update_profile(
    update_data: UserProfileUpdate,
    user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Update user profile"""
    try:
        return await user_service.update_profile(
            user=user,
            first_name=update_data.firstName,
            last_name=update_data.lastName,
            phone=update_data.phone
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/addresses", response_model=list[Address])
async def get_addresses(
    user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Get all user addresses"""
    return await user_service.get_addresses(user)


@router.post("/addresses", response_model=list[Address])
async def add_address(
    address: Address,
    user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Add new address to user profile"""
    try:
        return await user_service.add_address(user, address)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))