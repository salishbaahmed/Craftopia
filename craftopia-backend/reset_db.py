import asyncio
from app.database import engine
from sqlmodel import SQLModel
# Import all models to ensure they are registered with SQLModel.metadata
from app.models.user import User
from app.models.product import Product
from app.models.order import Order, OrderItem
from app.models.admin import Admin

async def reset_db():
    print("Dropping all tables...")
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)
        print("Tables dropped.")
        await conn.run_sync(SQLModel.metadata.create_all)
        print("Tables created with new schema.")

if __name__ == "__main__":
    asyncio.run(reset_db())
