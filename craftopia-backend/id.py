"""
Fix user table ID column to auto-generate UUIDs
"""
import asyncio
from sqlalchemy import text
from app.database import engine

async def fix_id_column():
    print("=" * 60)
    print("FIXING USER ID COLUMN")
    print("=" * 60)
    
    async with engine.begin() as conn:
        print("\n[1/3] Enabling uuid-ossp extension...")
        try:
            await conn.execute(text('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'))
            print("✓ UUID extension enabled")
        except Exception as e:
            print(f"  Extension already exists or error: {e}")
        
        print("\n[2/3] Setting default UUID generation for id column...")
        try:
            await conn.execute(text("""
                ALTER TABLE "user" 
                ALTER COLUMN id SET DEFAULT uuid_generate_v4()::VARCHAR
            """))
            print("✓ ID column will now auto-generate UUIDs")
        except Exception as e:
            print(f"✗ Error: {e}")
            raise
        
        print("\n[3/3] Verifying column default...")
        result = await conn.execute(text("""
            SELECT column_name, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'user' 
            AND column_name = 'id'
        """))
        
        col_info = result.fetchone()
        print(f"  Column: {col_info[0]}")
        print(f"  Default: {col_info[1]}")
    
    print("\n" + "=" * 60)
    print("FIX COMPLETE!")
    print("=" * 60)
    print("\nNext: python test_orders_flow.py")

if __name__ == "__main__":
    asyncio.run(fix_id_column())