from beanie import Document
from pydantic import EmailStr

class Admin(Document):
    email: EmailStr
    password: str
    role: str = "admin"

    class Settings:
        name = "admins"
        indexes = [
            "email"
        ]
