from typing import Optional, List
from beanie import Document
from pydantic import BaseModel, EmailStr
from datetime import datetime

class Address(BaseModel):
    street: str
    city: str
    province: str
    zipCode: str
    phone: str

class User(Document):
    firstName: str
    lastName: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    addresses: List[Address] = []
    createdAt: datetime = datetime.now()

    class Settings:
        name = "users"
        indexes = [
            "email"
        ]
