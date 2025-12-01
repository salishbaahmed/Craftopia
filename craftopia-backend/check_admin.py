import asyncio
import sqlite3
from app.database import init_db, get_session
from app.models.admin import Admin
from sqlmodel import select

async def check_admin():
    # Check SQLite database structure
    conn = sqlite3.connect('craftopia.db')
    cursor = conn.cursor()
    
    # Check if admin table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='admin'")
    table_exists = cursor.fetchone()
    print(f"Admin table exists: {table_exists is not None}")
    
    if table_exists:
        # Get table structure
        cursor.execute("PRAGMA table_info(admin)")
        columns = cursor.fetchall()
        print("\nAdmin table columns:")
        for col in columns:
            print(f"  - {col[1]} ({col[2]})")
        
        # Check if any admin exists
        cursor.execute("SELECT * FROM admin")
        admins = cursor.fetchall()
        print(f"\nNumber of admins in database: {len(admins)}")
        if admins:
            print("Admin records:")
            for admin in admins:
                print(f"  {admin}")
    
    conn.close()
    
    # Check using SQLModel
    await init_db()
    async for session in get_session():
        result = await session.execute(select(Admin))
        admins = result.scalars().all()
        print(f"\nAdmins found via SQLModel: {len(admins)}")
        for admin in admins:
            print(f"  Email: {admin.email}, Role: {admin.role}")
        break

if __name__ == "__main__":
    asyncio.run(check_admin())
