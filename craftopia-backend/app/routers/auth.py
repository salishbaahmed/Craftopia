from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from app.models.user import User
from app.models.admin import Admin
from app.utils.auth import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import timedelta
from app.config import settings
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_session
from sqlmodel import select

router = APIRouter()

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

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate, session: AsyncSession = Depends(get_session)):
    print(f"Register request received for: {user_data.email}")
    # Check if user exists
    result = await session.execute(select(User).where(User.email == user_data.email))
    existing_user = result.scalars().first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        firstName=user_data.firstName,
        lastName=user_data.lastName,
        email=user_data.email,
        password=hashed_password
    )
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.email, "role": "user"}, expires_delta=access_token_expires
    )
    print("User registered successfully")
    return {"access_token": access_token, "token_type": "bearer", "role": "user"}

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, session: AsyncSession = Depends(get_session)):
    if login_data.role == "admin":
        result = await session.execute(select(Admin).where(Admin.email == login_data.email))
        user = result.scalars().first()
    else:
        result = await session.execute(select(User).where(User.email == login_data.email))
        user = result.scalars().first()
        
    if not user or not verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": login_data.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": login_data.role}

@router.get("/me")
async def read_users_me(current_user = Depends(get_current_user)):
    return current_user
