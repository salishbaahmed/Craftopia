from fastapi import APIRouter, Depends, HTTPException
from app.models.user import User, Address
from app.utils.auth import get_current_user
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session

router = APIRouter()

class UserProfileUpdate(BaseModel):
    firstName: str
    lastName: str
    phone: str

@router.get("/profile", response_model=User)
async def get_profile(user: User = Depends(get_current_user)):
    return user

@router.put("/profile", response_model=User)
async def update_profile(update_data: UserProfileUpdate, user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    user.firstName = update_data.firstName
    user.lastName = update_data.lastName
    user.phone = update_data.phone
    
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

@router.get("/addresses", response_model=list[Address])
async def get_addresses(user: User = Depends(get_current_user)):
    return user.addresses

@router.post("/addresses", response_model=list[Address])
async def add_address(address: Address, user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    # Since addresses is a JSON column, we need to be careful with updates
    # We create a new list to ensure SQLAlchemy detects the change
    current_addresses = user.addresses or []
    # Convert Pydantic model to dict if it's not already (SQLModel might handle it but dict is safer for JSON column)
    # Actually, Address is a SQLModel, so .dict() works.
    # But wait, if we defined `sa_column=Column(JSON)`, SQLAlchemy expects python objects that can be serialized to JSON (dicts, lists).
    # It might not automatically serialize Pydantic objects unless we use a custom type.
    # For safety, let's convert to dict.
    
    # However, the response model expects list[Address].
    
    address_dict = address.dict()
    user.addresses = current_addresses + [address_dict]
    
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user.addresses
