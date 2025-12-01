import asyncio
from app.database import init_db, get_session
from app.models.admin import Admin
from app.utils.auth import get_password_hash

async def create_admin():
    await init_db()
    
    async for session in get_session():
        # Create admin user
        admin = Admin(
            email="admin@craftopia.com",
            password=get_password_hash("admin123"),
            firstName="Admin",
            lastName="User"
        )
        
        session.add(admin)
        await session.commit()
        await session.refresh(admin)
        
        print(f"Admin created successfully!")
        print(f"Email: admin@craftopia.com")
        print(f"Password: admin123")
        print(f"Admin ID: {admin.id}")
        break

if __name__ == "__main__":
    asyncio.run(create_admin())
