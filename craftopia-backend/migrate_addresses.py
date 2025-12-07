"""
Database Migration Script - Add addresses column (PostgreSQL)
File: migrate_addresses.py

Run this script to add the addresses column to existing database.
Place in the root of craftopia-backend folder.
"""
import asyncio
from sqlalchemy import text
from app.database import engine


async def migrate_add_addresses_column():
    """Add addresses JSON column to users table"""
    print("Starting migration: Adding addresses column to users table...")
    
    try:
        async with engine.begin() as conn:
            # Check if column already exists (PostgreSQL syntax)
            result = await conn.execute(text("""
                SELECT COUNT(*) 
                FROM information_schema.columns 
                WHERE table_name = 'users' 
                AND column_name = 'addresses'
            """))
            exists = result.scalar()
            
            if exists:
                print("✓ Column 'addresses' already exists. Skipping migration.")
                return
            
            # Add the addresses column (PostgreSQL syntax)
            await conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN addresses JSONB DEFAULT NULL
            """))
            
            print("✓ Successfully added 'addresses' column to users table")
            print("✓ Migration completed successfully!")
            
    except Exception as e:
        print(f"✗ Migration failed: {str(e)}")
        raise


if __name__ == "__main__":
    print("=" * 60)
    print("Craftopia Database Migration (PostgreSQL)")
    print("Adding addresses support to user model")
    print("=" * 60)
    asyncio.run(migrate_add_addresses_column())
    print("=" * 60)