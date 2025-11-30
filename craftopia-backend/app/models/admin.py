from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import EmailStr
import uuid

class Admin(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: EmailStr = Field(index=True, unique=True)
    password: str
    role: str = "admin"
