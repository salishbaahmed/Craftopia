from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from pydantic import EmailStr
from datetime import datetime
from sqlalchemy import Column, JSON
import uuid

class Address(SQLModel):
    street: str
    city: str
    province: str
    zipCode: str
    phone: str

class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    firstName: str
    lastName: str
    email: EmailStr = Field(index=True, unique=True)
    password: str
    phone: Optional[str] = None
    addresses: List[Address] = Field(default=[], sa_column=Column(JSON))
    createdAt: datetime = Field(default_factory=datetime.now)
