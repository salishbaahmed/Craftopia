"""
Fix Admin Table - Manually recreate with correct schema
"""
import asyncio
from sqlalchemy import text
from app.database import engine

async def fix_admin_table():
    print("=" * 60)
    print("FIXING ADMIN TABLE SCHEMA")
    print("=" * 60)
    
    try:
        async with engine.begin() as conn:
            print("\n[1/2] Dropping old admin table...")
            await conn.execute(text("DROP TABLE IF EXISTS admin CASCADE"))
            print("✓ Old admin table dropped")
            
            print("\n[2/2] Creating new admin table with correct schema...")
            await conn.execute(text("""
                CREATE TABLE admin (
                    id VARCHAR PRIMARY KEY,
                    email VARCHAR UNIQUE NOT NULL,
                    password_hash VARCHAR NOT NULL,
                    first_name VARCHAR,
                    last_name VARCHAR,
                    role VARCHAR DEFAULT 'admin',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            print("✓ New admin table created with password_hash column")
            
            print("\n" + "=" * 60)
            print("ADMIN TABLE FIXED!")
            print("=" * 60)
            print("\nNext step: Run python create_admin.py")
            
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(fix_admin_table())