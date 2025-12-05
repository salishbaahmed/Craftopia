import asyncio
from app.database import init_db, get_session
from app.models.admin import Admin
from sqlalchemy import select

async def check_admin():
    await init_db()
    
    async for session in get_session():
        # Query all admins
        result = await session.execute(select(Admin))
        admins = result.scalars().all()
        
        print(f"Found {len(admins)} admin(s) in database:")
        for admin in admins:
            print(f"\nAdmin ID: {admin.id}")
            print(f"Email: {admin.email}")
            print(f"First Name: {admin.firstName}")
            print(f"Last Name: {admin.lastName}")
            print(f"Password Hash: {admin.password[:50]}...")
        
        if not admins:
            print("\n⚠️ No admins found! Run create_admin.py first.")
        
        break

if __name__ == "__main__":
    asyncio.run(check_admin())