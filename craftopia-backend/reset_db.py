"""
Fixed Database Reset Script for PostgreSQL
File: reset_db_fixed.py

This script drops all tables using raw SQL to avoid foreign key issues.
"""
import asyncio
from sqlalchemy import text
from sqlmodel import SQLModel
from app.database import engine

# Import all models to ensure they're registered with SQLModel
from app.models.user import User
from app.models.admin import Admin
from app.models.product import Product
from app.models.order import Order


async def reset_db():
    """Drop all tables and recreate them"""
    print("=" * 60)
    print("RESETTING DATABASE")
    print("=" * 60)
    
    print("\n[1/3] Dropping all tables...")
    try:
        async with engine.begin() as conn:
            # Drop each table separately (asyncpg doesn't support multiple commands)
            await conn.execute(text("DROP TABLE IF EXISTS orders CASCADE"))
            await conn.execute(text("DROP TABLE IF EXISTS products CASCADE"))
            await conn.execute(text("DROP TABLE IF EXISTS users CASCADE"))
            await conn.execute(text("DROP TABLE IF EXISTS admins CASCADE"))
            print("✓ All tables dropped successfully")
    except Exception as e:
        print(f"✗ Error dropping tables: {e}")
        raise
    
    print("\n[2/3] Creating all tables...")
    try:
        async with engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
            print("✓ All tables created successfully")
    except Exception as e:
        print(f"✗ Error creating tables: {e}")
        raise
    
    print("\n[3/3] Verifying tables...")
    try:
        async with engine.begin() as conn:
            result = await conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """))
            tables = result.fetchall()
            
            if tables:
                print("✓ Tables created:")
                for table in tables:
                    print(f"  - {table[0]}")
            else:
                print("⚠ Warning: No tables found!")
    except Exception as e:
        print(f"✗ Error verifying tables: {e}")
    
    print("\n" + "=" * 60)
    print("DATABASE RESET COMPLETE!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Run: python create_admin.py")
    print("2. Start your server: python main.py")
    print("3. Register new customer accounts")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(reset_db())