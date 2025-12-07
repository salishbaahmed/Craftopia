"""
Admin Model
"""
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid


class Admin(SQLModel, table=True):
    """Admin user model"""
    __tablename__ = "admin"
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str  # Fixed: Changed from 'password' to 'password_hash'
    
    # Map Python snake_case to match User model
    first_name: Optional[str] = Field(default=None)
    last_name: Optional[str] = Field(default=None)
    
    role: str = Field(default="admin")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        # Allow both camelCase and snake_case
        populate_by_name = True