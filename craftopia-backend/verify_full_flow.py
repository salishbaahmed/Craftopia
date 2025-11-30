import asyncio
import sys

BASE_URL = "http://127.0.0.1:8000"

async def verify_flow():
    import httpx
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=10.0) as client:
        print("1. Checking API health...")
        try:
            resp = await client.get("/")
            print(f"Health check: {resp.status_code}")
        except Exception as e:
            print(f"Failed to connect to API: {e}")
            return

        # 2. Register/Login
        email = "flow_test@example.com"
        password = "password123"
        token = None
        
        print("\n2. Authenticating...")
        # Try login first
        resp = await client.post("/api/auth/login", json={
            "email": email,
            "password": password,
            "role": "user"
        })
        
        if resp.status_code == 200:
            token = resp.json()["access_token"]
            print("Logged in successfully.")
        else:
            print("Login failed, trying to register...")
            resp = await client.post("/api/auth/register", json={
                "firstName": "Flow",
                "lastName": "Test",
                "email": email,
                "password": password
            })
            if resp.status_code == 200:
                token = resp.json()["access_token"]
                print("Registered successfully.")
            else:
                print(f"Registration failed: {resp.text}")
                return

        headers = {"Authorization": f"Bearer {token}"}

        # 3. Create Order
        print("\n3. Creating Order...")
        order_payload = {
            "items": [
                {"productId": "prod_1", "name": "Test Item", "price": 500, "quantity": 2}
            ],
            "shippingAddress": {"street": "123 Test St"},
            "subtotal": 1000,
            "discount": 0,
            "tax": 0,
            "total": 1000,
            "paymentStatus": "Paid"
        }
        
        resp = await client.post("/api/orders/", json=order_payload, headers=headers)
        if resp.status_code == 201:
            order_data = resp.json()
            order_id = order_data["id"]
            print(f"Order created: {order_id}")
        else:
            print(f"Order creation failed: {resp.text}")
            return

        # 4. Download Invoice
        print("\n4. Downloading Invoice...")
        resp = await client.get(f"/api/orders/{order_id}/invoice", headers=headers)
        
        if resp.status_code == 200:
            content_type = resp.headers.get("content-type")
            content_length = len(resp.content)
            print(f"Invoice downloaded successfully!")
            print(f"Content-Type: {content_type}")
            print(f"Size: {content_length} bytes")
            
            if content_length > 0 and "application/pdf" in content_type:
                print("SUCCESS: Valid PDF response received.")
            else:
                print("WARNING: Response might not be a valid PDF.")
        else:
            print(f"Invoice download failed: {resp.status_code} - {resp.text}")

if __name__ == "__main__":
    # Install httpx if missing
    import subprocess
    try:
        import httpx
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "httpx"])
        import httpx
        
    asyncio.run(verify_flow())
