"""
Migrate user table schema to match new User model
"""
import asyncio
from sqlalchemy import text
from app.database import engine

async def migrate_user_table():
    print("=" * 60)
    print("MIGRATING USER TABLE SCHEMA")
    print("=" * 60)
    
    async with engine.begin() as conn:
        # 1. Rename password to password_hash
        print("\n[1/8] Renaming 'password' column to 'password_hash'...")
        try:
            await conn.execute(text("""
                ALTER TABLE "user" 
                RENAME COLUMN password TO password_hash
            """))
            print("✓ Renamed password → password_hash")
        except Exception as e:
            print(f"  Already renamed or error: {e}")
        
        # 2. Rename phone to phone_number
        print("\n[2/8] Renaming 'phone' column to 'phone_number'...")
        try:
            await conn.execute(text("""
                ALTER TABLE "user" 
                RENAME COLUMN phone TO phone_number
            """))
            print("✓ Renamed phone → phone_number")
        except Exception as e:
            print(f"  Already renamed or error: {e}")
        
        # 3. Add missing address-related columns
        print("\n[3/8] Adding address columns...")
        columns_to_add = [
            ("address", "VARCHAR"),
            ("city", "VARCHAR"),
            ("state", "VARCHAR"),
            ("zip_code", "VARCHAR"),
            ("country", "VARCHAR DEFAULT 'Pakistan'")
        ]
        
        for col_name, col_type in columns_to_add:
            try:
                await conn.execute(text(f"""
                    ALTER TABLE "user" 
                    ADD COLUMN IF NOT EXISTS {col_name} {col_type}
                """))
                print(f"  ✓ Added {col_name}")
            except Exception as e:
                print(f"  Column {col_name} exists or error: {e}")
        
        # 4. Add account status columns
        print("\n[4/8] Adding account status columns...")
        status_columns = [
            ("is_active", "BOOLEAN DEFAULT TRUE"),
            ("is_verified", "BOOLEAN DEFAULT FALSE")
        ]
        
        for col_name, col_type in status_columns:
            try:
                await conn.execute(text(f"""
                    ALTER TABLE "user" 
                    ADD COLUMN IF NOT EXISTS {col_name} {col_type}
                """))
                print(f"  ✓ Added {col_name}")
            except Exception as e:
                print(f"  Column {col_name} exists or error: {e}")
        
        # 5. Add loyalty/rewards columns
        print("\n[5/8] Adding loyalty columns...")
        loyalty_columns = [
            ("loyalty_points", "INTEGER DEFAULT 0"),
            ("total_orders", "INTEGER DEFAULT 0"),
            ("total_spent", "FLOAT DEFAULT 0.0")
        ]
        
        for col_name, col_type in loyalty_columns:
            try:
                await conn.execute(text(f"""
                    ALTER TABLE "user" 
                    ADD COLUMN IF NOT EXISTS {col_name} {col_type}
                """))
                print(f"  ✓ Added {col_name}")
            except Exception as e:
                print(f"  Column {col_name} exists or error: {e}")
        
        # 6. Add updated_at column
        print("\n[6/8] Adding updated_at column...")
        try:
            await conn.execute(text("""
                ALTER TABLE "user" 
                ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            """))
            print("  ✓ Added updated_at")
        except Exception as e:
            print(f"  Column exists or error: {e}")
        
        # 7. Verify final schema
        print("\n[7/8] Verifying final schema...")
        result = await conn.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'user' 
            ORDER BY ordinal_position
        """))
        
        columns = result.fetchall()
        print(f"  ✓ Final columns ({len(columns)}):")
        for col in columns:
            print(f"    - {col[0]}: {col[1]}")
        
        # 8. Check users still exist
        print("\n[8/8] Verifying user data...")
        result = await conn.execute(text("SELECT COUNT(*) FROM \"user\""))
        count = result.scalar()
        print(f"  ✓ {count} user(s) preserved")
    
    print("\n" + "=" * 60)
    print("MIGRATION COMPLETE!")
    print("=" * 60)
    print("\nNext: python start_debug.py")

if __name__ == "__main__":
    asyncio.run(migrate_user_table())