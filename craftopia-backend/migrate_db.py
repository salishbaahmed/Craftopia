import asyncio
from app.database import engine
from sqlalchemy import text

async def migrate():
    async with engine.begin() as conn:
        print("Migrating database...")
        try:
            await conn.execute(text('ALTER TABLE "order" ADD COLUMN deliveryStatus VARCHAR DEFAULT \'pending\''))
            print("Added deliveryStatus")
        except Exception as e:
            print(f"deliveryStatus might already exist: {e}")

        try:
            await conn.execute(text('ALTER TABLE "order" ADD COLUMN deliveryHistory JSON DEFAULT \'[]\''))
            print("Added deliveryHistory")
        except Exception as e:
            print(f"deliveryHistory might already exist: {e}")

        try:
            await conn.execute(text('ALTER TABLE "order" ADD COLUMN estimatedDelivery VARCHAR'))
            print("Added estimatedDelivery")
        except Exception as e:
            print(f"estimatedDelivery might already exist: {e}")

        try:
            await conn.execute(text('ALTER TABLE "order" ADD COLUMN deliveryDate VARCHAR'))
            print("Added deliveryDate")
        except Exception as e:
            print(f"deliveryDate might already exist: {e}")
            
    print("Migration complete.")

if __name__ == "__main__":
    asyncio.run(migrate())
