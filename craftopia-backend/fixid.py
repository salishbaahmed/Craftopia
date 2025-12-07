"""
Fix the database column type mismatch
The simplest solution: recreate the user table with correct schema
"""
import asyncio
from sqlalchemy import text
from app.database import engine

async def fix_database():
    print("=" * 60)
    print("FIXING DATABASE SCHEMA MISMATCH")
    print("=" * 60)
    
    async with engine.begin() as conn:
        print("\n⚠️  This will delete all users and orders!")
        print("Proceeding in 3 seconds...")
        await asyncio.sleep(3)
        
        print("\n[1/4] Dropping orders and order items...")
        await conn.execute(text("DROP TABLE IF EXISTS orderitem CASCADE"))
        await conn.execute(text("DROP TABLE IF EXISTS \"order\" CASCADE"))
        print("✓ Dropped order tables")
        
        print("\n[2/4] Dropping user table...")
        await conn.execute(text("DROP TABLE IF EXISTS \"user\" CASCADE"))
        print("✓ Dropped user table")
        
        print("\n[3/4] Creating user table with correct schema...")
        await conn.execute(text("""
            CREATE TABLE "user" (
                id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4()::VARCHAR,
                email VARCHAR UNIQUE NOT NULL,
                password_hash VARCHAR NOT NULL,
                first_name VARCHAR NOT NULL,
                last_name VARCHAR NOT NULL,
                phone_number VARCHAR,
                address VARCHAR,
                city VARCHAR,
                state VARCHAR,
                zip_code VARCHAR,
                country VARCHAR DEFAULT 'Pakistan',
                addresses JSON,
                is_active BOOLEAN DEFAULT TRUE,
                is_verified BOOLEAN DEFAULT FALSE,
                loyalty_points INTEGER DEFAULT 0,
                total_orders INTEGER DEFAULT 0,
                total_spent FLOAT DEFAULT 0.0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))
        print("✓ Created user table with VARCHAR id")
        
        print("\n[4/4] Creating order tables...")
        await conn.execute(text("""
            CREATE TABLE "order" (
                id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4()::VARCHAR,
                "userId" VARCHAR NOT NULL REFERENCES "user"(id),
                "shippingAddress" JSON,
                subtotal FLOAT,
                discount FLOAT,
                tax FLOAT,
                total FLOAT,
                status VARCHAR DEFAULT 'pending',
                "paymentStatus" VARCHAR DEFAULT 'Pending',
                "deliveryStatus" VARCHAR DEFAULT 'pending',
                "deliveryHistory" JSON DEFAULT '[]',
                "estimatedDelivery" VARCHAR,
                "deliveryDate" VARCHAR,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))
        
        await conn.execute(text("""
            CREATE TABLE orderitem (
                id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4()::VARCHAR,
                order_id VARCHAR REFERENCES "order"(id),
                "productId" VARCHAR,
                name VARCHAR,
                price FLOAT,
                quantity INTEGER,
                image VARCHAR
            )
        """))
        print("✓ Created order tables")
    
    print("\n" + "=" * 60)
    print("DATABASE FIXED!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. python create_admin.py")
    print("2. python start_debug.py")
    print("3. python test_orders_flow.py")

if __name__ == "__main__":
    asyncio.run(fix_database())