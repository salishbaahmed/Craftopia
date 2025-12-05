"""
User Model
"""
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON
from typing import Optional, List
from datetime import datetime
from pydantic import EmailStr
import uuid


class Address(SQLModel):
    """Address sub-model (not a table)"""
    street: str
    city: str
    state: str
    zipCode: str
    country: str
    isDefault: bool = False


class User(SQLModel, table=True):
    """User model"""
    __tablename__ = "user"
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True)
    password: str
    
    # Map Python camelCase to DB snake_case
    firstName: str = Field(sa_column_kwargs={"name": "first_name"})
    lastName: str = Field(sa_column_kwargs={"name": "last_name"})
    phone: Optional[str] = Field(default=None)
    
    addresses: Optional[List[dict]] = Field(
        default=None,
        sa_column=Column(JSON)
    )
    
    createdAt: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"name": "created_at"}
    )
    
    class Config:
        populate_by_name = True