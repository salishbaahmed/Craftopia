"""
Check which table has users
"""
import asyncio
from sqlalchemy import text
from app.database import engine

async def check_tables():
    print("=" * 60)
    print("CHECKING USER TABLES")
    print("=" * 60)
    
    async with engine.begin() as conn:
        # Check 'user' table
        print("\n[1] Checking 'user' table...")
        try:
            result = await conn.execute(text("SELECT id, email FROM \"user\" LIMIT 5"))
            users = result.fetchall()
            print(f"✓ Found {len(users)} user(s) in 'user' table:")
            for user in users:
                print(f"  - ID: {user[0]}, Email: {user[1]}")
        except Exception as e:
            print(f"✗ Error: {e}")
        
        # Check 'users' table
        print("\n[2] Checking 'users' table...")
        try:
            result = await conn.execute(text("SELECT id, email FROM \"users\" LIMIT 5"))
            users = result.fetchall()
            print(f"✓ Found {len(users)} user(s) in 'users' table:")
            for user in users:
                print(f"  - ID: {user[0]}, Email: {user[1]}")
        except Exception as e:
            print(f"✗ Error: {e}")
        
        print("\n" + "=" * 60)

if __name__ == "__main__":
    asyncio.run(check_tables())