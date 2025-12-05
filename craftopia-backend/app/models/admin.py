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
    password: str
    
    # Map Python camelCase to DB snake_case
    firstName: Optional[str] = Field(default=None, sa_column_kwargs={"name": "first_name"})
    lastName: Optional[str] = Field(default=None, sa_column_kwargs={"name": "last_name"})
    
    role: str = Field(default="admin")
    createdAt: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column_kwargs={"name": "created_at"}
    )
    
    class Config:
        # Allow both camelCase and snake_case
        populate_by_name = True