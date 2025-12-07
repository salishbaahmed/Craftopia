"""
Users Router - Complete Updated Version
File: app/routers/users.py
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional

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
    name: Optional[str] = None
    street: str
    city: str
    state: str
    zipCode: str
    country: str
    phone: Optional[str] = None
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
    addresses = await user_service.get_addresses(current_user)
    return addresses


@router.post("/addresses")
async def add_address(
    request: AddAddressRequest,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Add new address"""
    try:
        address_data = {
            "name": request.name,
            "street": request.street,
            "city": request.city,
            "state": request.state,
            "zipCode": request.zipCode,
            "country": request.country,
            "phone": request.phone,
            "isDefault": request.isDefault
        }
        
        addresses = await user_service.add_address(current_user, address_data)
        return {"message": "Address added successfully", "addresses": addresses}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/addresses/{address_id}")
async def update_address(
    address_id: int,
    request: AddAddressRequest,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Update an existing address"""
    try:
        address_data = {
            "name": request.name,
            "street": request.street,
            "city": request.city,
            "state": request.state,
            "zipCode": request.zipCode,
            "country": request.country,
            "phone": request.phone,
            "isDefault": request.isDefault
        }
        
        addresses = await user_service.update_address(
            current_user, 
            address_id, 
            address_data
        )
        return {"message": "Address updated successfully", "addresses": addresses}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/addresses/{address_id}")
async def delete_address(
    address_id: int,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Delete an address"""
    try:
        addresses = await user_service.delete_address(current_user, address_id)
        return {"message": "Address deleted successfully", "addresses": addresses}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/addresses/{address_id}/default")
async def set_default_address(
    address_id: int,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Set an address as the default address"""
    try:
        addresses = await user_service.set_default_address(current_user, address_id)
        return {"message": "Default address updated successfully", "addresses": addresses}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))