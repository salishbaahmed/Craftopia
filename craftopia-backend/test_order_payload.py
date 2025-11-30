import asyncio
import httpx
import json

async def test_order_payload():
    # This is the exact structure the frontend is sending
    payload = {
        "items": [
            {
                "productId": "test-123",
                "name": "Test Product",
                "price": 4200,
                "quantity": 1,
                "image": ""
            }
        ],
        "shippingAddress": {
            "firstName": "John",
            "lastName": "Doe",
            "address": "123 Test St",
            "city": "Test City",
            "province": "Test Province",
            "zipCode": "12345",
            "phone": "1234567890"
        },
        "subtotal": 4200,
        "discount": 420,
        "tax": 189,
        "total": 3969,
        "paymentStatus": "Paid"
    }
    
    print("Testing payload:")
    print(json.dumps(payload, indent=2))
    print("\n" + "="*50 + "\n")
    
    # First, login to get a token
    async with httpx.AsyncClient(base_url="http://127.0.0.1:8000", timeout=10.0) as client:
        # Try to login
        login_resp = await client.post("/api/auth/login", json={
            "email": "flow_test@example.com",
            "password": "password123",
            "role": "user"
        })
        
        if login_resp.status_code != 200:
            print("Login failed, cannot test order creation")
            return
            
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Try to create order
        print("Sending POST /api/orders/")
        resp = await client.post("/api/orders/", json=payload, headers=headers)
        
        print(f"Status: {resp.status_code}")
        print(f"Response: {json.dumps(resp.json(), indent=2)}")

if __name__ == "__main__":
    asyncio.run(test_order_payload())
