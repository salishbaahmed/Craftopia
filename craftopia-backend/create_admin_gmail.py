import asyncio
from app.database import init_db, get_session
from app.models.admin import Admin
from app.utils.auth import get_password_hash, verify_password
from sqlalchemy import select

async def create_admin_gmail():
    await init_db()
    
    async for session in get_session():
        # Check if admin already exists
        result = await session.execute(
            select(Admin).where(Admin.email == "admin@gmail.com")
        )
        existing = result.scalars().first()
        
        if existing:
            print("Admin with admin@gmail.com already exists!")
            print(f"ID: {existing.id}")
            break
        
        # Create new admin
        password = "admin123"
        hashed_password = get_password_hash(password)
        
        # Verify hash works
        if not verify_password(password, hashed_password):
            print("❌ Hash verification failed!")
            break
        
        admin = Admin(
            email="admin@gmail.com",
            password=hashed_password,
            firstName="Admin",
            lastName="User"
        )
        
        session.add(admin)
        await session.commit()
        await session.refresh(admin)
        
        print("✅ Admin created successfully!")
        print(f"Email: admin@gmail.com")
        print(f"Password: admin123")
        print(f"ID: {admin.id}")
        
        break

if __name__ == "__main__":
    asyncio.run(create_admin_gmail())