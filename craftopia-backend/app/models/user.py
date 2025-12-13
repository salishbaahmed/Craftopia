"""
 
File: app/models/user.py
"""
from sqlmodel import Field, SQLModel, Column, JSON
from sqlalchemy import String  
from typing import Optional, List, Dict
from datetime import datetime
import uuid


class Address(SQLModel):
    """Address embedded model"""
    name: Optional[str] = None
    street: str
    city: str
    state: str
    zipCode: str
    country: str
    phone: Optional[str] = None
    isDefault: bool = False


class User(SQLModel, table=True):
    """User model for customer accounts"""
    __tablename__ = "user"  
     
    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()), 
        primary_key=True, 
        sa_type=String   
    )
    email: str = Field(unique=True, index=True)
    password_hash: str
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    
    # Address fields (legacy single address support)
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = "Pakistan"
    
    # New: Multiple addresses support
    addresses: Optional[List[Dict]] = Field(default=None, sa_column=Column(JSON))
    
    # Account status
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    
    # Loyalty and rewards
    loyalty_points: int = Field(default=0)
    total_orders: int = Field(default=0)
    total_spent: float = Field(default=0.0)
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "customer@example.com",
                "first_name": "John",
                "last_name": "Doe",
                "phone_number": "+92 300 1234567",
                "address": "123 Main Street",
                "city": "Lahore",
                "state": "Punjab",
                "zip_code": "54000",
                "country": "Pakistan"
            }
        }