import asyncio
import httpx
from app.utils.auth import create_access_token
from app.config import settings

async def test_api():
    # Generate Admin Token
    token = create_access_token(data={"sub": "admin@craftopia.com", "role": "admin"})
    print(f"Generated Token: {token[:20]}...")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                "http://127.0.0.1:8000/api/orders/admin/all",
                headers={"Authorization": f"Bearer {token}"}
            )
            print(f"Status Code: {response.status_code}")
            if response.status_code == 200:
                orders = response.json()
                print(f"Orders returned: {len(orders)}")
                if len(orders) > 0:
                    print(f"Sample Order: {orders[0]}")
            else:
                print(f"Error Response: {response.text}")
        except Exception as e:
            print(f"Request failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_api())
