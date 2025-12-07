"""
Check user table schema
"""
import asyncio
from sqlalchemy import text
from app.database import engine

async def check_schema():
    print("=" * 60)
    print("CHECKING USER TABLE SCHEMA")
    print("=" * 60)
    
    async with engine.begin() as conn:
        result = await conn.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'user' 
            ORDER BY ordinal_position
        """))
        
        columns = result.fetchall()
        print(f"\nColumns in 'user' table:")
        for col in columns:
            print(f"  - {col[0]}: {col[1]}")
        
        # Check for password vs password_hash
        col_names = [col[0] for col in columns]
        if 'password' in col_names:
            print("\n⚠️  Table has 'password' column (old schema)")
        if 'password_hash' in col_names:
            print("\n✓ Table has 'password_hash' column (new schema)")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    asyncio.run(check_schema())