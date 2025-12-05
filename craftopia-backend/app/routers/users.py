"""
Users Router
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List

from app.models.user import User, Address
from app.services.user_service import UserService
from app.dependencies import get_user_service, get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])


# Request Models
class UpdateProfileRequest(BaseModel):
    firstName: str
    lastName: str
    phone: str


class AddAddressRequest(BaseModel):
    street: str
    city: str
    state: str
    zipCode: str
    country: str
    isDefault: bool = False


@router.get("/profile")
async def get_profile(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Get current user's profile"""
    return await user_service.get_profile(current_user)


@router.put("/profile")
async def update_profile(
    request: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Update user profile"""
    try:
        updated_user = await user_service.update_profile(
            user=current_user,
            first_name=request.firstName,
            last_name=request.lastName,
            phone=request.phone
        )
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/addresses")
async def get_addresses(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Get user's addresses"""
    return await user_service.get_addresses(current_user)


@router.post("/addresses")
async def add_address(
    request: AddAddressRequest,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Add new address"""
    try:
        address = Address(**request.dict())
        addresses = await user_service.add_address(current_user, address)
        return {"addresses": addresses}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))