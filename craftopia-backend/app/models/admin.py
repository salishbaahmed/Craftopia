from sqlmodel import SQLModel, Field, select, Session
from typing import Optional
from datetime import datetime
import uuid
from app.database import get_session
from sqlalchemy.ext.asyncio import AsyncSession

class Admin(SQLModel, table=True):
    """Admin user model"""
    __tablename__ = "admin"
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    
    first_name: Optional[str] = Field(default=None)
    last_name: Optional[str] = Field(default=None)
    
    role: str = Field(default="admin")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config: 
        populate_by_name = True


class AdminManager:
    """Singleton to manage Admin operations"""
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            print("Creating a new AdminManager instance.")
            cls._instance = super(AdminManager, cls).__new__(cls)
        return cls._instance

    async def get_admin_by_email(self, email: str) -> Optional[Admin]:
        async for session in get_session():  # Assuming `get_session` yields a session
            result = await session.execute(select(Admin).where(Admin.email == email))
            admin = result.scalar_one_or_none()  # Returns single admin or None
            return admin

    async def create_admin(self, email: str, password_hash: str, first_name: Optional[str] = None, last_name: Optional[str] = None):
        """Create a new admin in the database"""
        new_admin = Admin(
            email=email,
            password_hash=password_hash,
            first_name=first_name,
            last_name=last_name
        )
        async for session in get_session():
            session.add(new_admin)
            await session.commit()  # Commit the transaction to save the new admin
            return new_admin

    async def get_all_admins(self) -> list[Admin]:
        """Get all admins in the database"""
        async for session in get_session():
            result = await session.execute(select(Admin))
            admins = result.scalars().all()
            return admins


# Example usage of the AdminManager singleton

async def check_admin():
    # Get the singleton instance
    admin_manager = AdminManager()

    # Fetch all admins
    admins = await admin_manager.get_all_admins()

    if admins:
        print(f"Found {len(admins)} admin(s) in database:")
        for admin in admins:
            print(f"\nAdmin ID: {admin.id}")
            print(f"Email: {admin.email}")
            print(f"First Name: {admin.first_name}")
            print(f"Last Name: {admin.last_name}")
            print(f"Password Hash: {admin.password_hash[:50]}...")
    else:
        print("\n⚠️ No admins found! Run create_admin.py first.")

if __name__ == "__main__":
    import asyncio
    asyncio.run(check_admin())
