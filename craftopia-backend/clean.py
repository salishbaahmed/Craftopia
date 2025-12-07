"""
Cleanup duplicate users table
"""
import asyncio
from sqlalchemy import text
from app.database import engine

async def cleanup():
    print("=" * 60)
    print("CLEANING UP DUPLICATE USERS TABLE")
    print("=" * 60)
    
    async with engine.begin() as conn:
        print("\nDropping 'users' table (keeping 'user' table)...")
        await conn.execute(text("DROP TABLE IF EXISTS users CASCADE"))
        print("✓ Dropped duplicate 'users' table")
        
        print("\nVerifying remaining tables...")
        result = await conn.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('user', 'users')
            ORDER BY table_name
        """))
        tables = result.fetchall()
        
        if tables:
            print("✓ User tables remaining:")
            for table in tables:
                print(f"  - {table[0]}")
        
    print("\n" + "=" * 60)
    print("CLEANUP COMPLETE!")
    print("=" * 60)
    print("\nNext: python test_orders_flow.py")

if __name__ == "__main__":
    asyncio.run(cleanup())