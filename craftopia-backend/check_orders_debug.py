import asyncio
import httpx
from app.database import get_session, engine
from app.models.order import Order
from app.models.admin import Admin
from sqlmodel import select
from app.utils.auth import create_access_token
from app.config import settings

async def check_system():
    print("--- Checking Database ---")
    try:
        async with engine.connect() as conn:
            print("Database connection successful.")
        
        async for session in get_session():
            result = await session.execute(select(Order))
            orders = result.scalars().all()
            print(f"Total orders in DB: {len(orders)}")
            if orders:
                print(f"Sample Order Status: {orders[0].status}, Delivery: {getattr(orders[0], 'deliveryStatus', 'N/A')}")
            break
    except Exception as e:
        print(f"Database check failed: {e}")

    print("\n--- Checking API ---")
    try:
        token = create_access_token(data={"sub": "admin@craftopia.com", "role": "admin"})
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "http://127.0.0.1:8000/api/orders/admin/all",
                headers={"Authorization": f"Bearer {token}"}
            )
            print(f"API Status Code: {response.status_code}")
            if response.status_code != 200:
                print(f"API Error: {response.text}")
            else:
                print(f"API Orders: {len(response.json())}")
    except Exception as e:
        print(f"API check failed: {repr(e)}")

if __name__ == "__main__":
    asyncio.run(check_system())
