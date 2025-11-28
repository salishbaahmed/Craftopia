from fastapi import APIRouter, Depends, HTTPException
from app.models.user import User, Address
from app.utils.auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

class UserProfileUpdate(BaseModel):
    firstName: str
    lastName: str
    phone: str

@router.get("/profile", response_model=User)
async def get_profile(user: User = Depends(get_current_user)):
    return user

@router.put("/profile", response_model=User)
async def update_profile(update_data: UserProfileUpdate, user: User = Depends(get_current_user)):
    user.firstName = update_data.firstName
    user.lastName = update_data.lastName
    user.phone = update_data.phone
    await user.save()
    return user

@router.get("/addresses", response_model=list[Address])
async def get_addresses(user: User = Depends(get_current_user)):
    return user.addresses

@router.post("/addresses", response_model=list[Address])
async def add_address(address: Address, user: User = Depends(get_current_user)):
    user.addresses.append(address)
    await user.save()
    return user.addresses
