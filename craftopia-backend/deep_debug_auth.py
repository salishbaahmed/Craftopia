import requests
import json
import asyncio
from app.utils import TokenHandler
from app.database import init_db, get_session
from app.models.admin import Admin
from sqlalchemy import select

async def check_admin_in_db():
    """Check if admin exists in database"""
    print("\n" + "=" * 60)
    print("CHECKING DATABASE")
    print("=" * 60)
    
    await init_db()
    
    async for session in get_session():
        result = await session.execute(
            select(Admin).where(Admin.email == "admin@craftopia.com")
        )
        admin = result.scalars().first()
        
        if admin:
            print(f"✅ Admin found in database")
            print(f"   ID: {admin.id}")
            print(f"   Email: {admin.email}")
            print(f"   Type: {type(admin).__name__}")
        else:
            print(f"❌ Admin NOT found in database")
        
        break
    
    return admin

def test_token_decode():
    """Test token creation and decoding"""
    print("\n" + "=" * 60)
    print("TOKEN GENERATION & DECODING TEST")
    print("=" * 60)
    
    # Login
    print("\n1. Logging in as admin...")
    login_response = requests.post(
        "http://localhost:8000/api/auth/login",
        json={
            "email": "admin@craftopia.com",
            "password": "admin123",
            "role": "admin"
        }
    )
    
    print(f"   Status: {login_response.status_code}")
    
    if login_response.status_code != 200:
        print(f"   ❌ Login failed: {login_response.text}")
        return None
    
    token_data = login_response.json()
    token = token_data.get("access_token")
    role = token_data.get("role")
    
    print(f"   ✅ Login successful")
    print(f"   Role from response: {role}")
    print(f"   Token: {token[:50]}...")
    
    # Decode token locally
    print("\n2. Decoding token locally...")
    try:
        token_handler = TokenHandler()
        payload = token_handler.decode_token(token)
        
        print(f"   ✅ Token decoded")
        print(f"   Payload:")
        print(f"     - sub (email): {payload.get('sub')}")
        print(f"     - role: {payload.get('role')}")
        print(f"     - exp: {payload.get('exp')}")
        
    except Exception as e:
        print(f"   ❌ Decode failed: {e}")
        return None
    
    return token

def test_endpoints(token):
    """Test various endpoints with the token"""
    print("\n" + "=" * 60)
    print("ENDPOINT TESTS")
    print("=" * 60)
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Test 1: GET products (public)
    print("\n1. GET /api/products/ (public, no auth needed)")
    response = requests.get("http://localhost:8000/api/products/")
    print(f"   Status: {response.status_code}")
    
    # Test 2: GET orders admin (requires admin auth)
    print("\n2. GET /api/orders/admin/all (admin only)")
    response = requests.get(
        "http://localhost:8000/api/orders/admin/all",
        headers=headers
    )
    print(f"   Status: {response.status_code}")
    if response.status_code != 200:
        try:
            print(f"   Response: {json.dumps(response.json(), indent=2)}")
        except:
            print(f"   Response: {response.text}")
    
    # Test 3: POST product (requires admin auth)
    print("\n3. POST /api/products (admin only)")
    product_data = {
        "name": "Deep Debug Test",
        "description": "Testing auth",
        "price": 19.99,
        "category": "Test",
        "stock": 1,
        "images": []
    }
    
    response = requests.post(
        "http://localhost:8000/api/products",
        json=product_data,
        headers=headers
    )
    print(f"   Status: {response.status_code}")
    try:
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"   Response: {response.text}")
    
    # Test 4: Same with trailing slash
    print("\n4. POST /api/products/ (with slash)")
    product_data["name"] = "Deep Debug Test 2"
    
    response = requests.post(
        "http://localhost:8000/api/products/",
        json=product_data,
        headers=headers
    )
    print(f"   Status: {response.status_code}")
    try:
        print(f"   Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"   Response: {response.text}")

async def main():
    """Run all tests"""
    print("=" * 60)
    print("DEEP AUTHENTICATION DEBUG")
    print("=" * 60)
    
    # Check database
    await check_admin_in_db()
    
    # Test token
    token = test_token_decode()
    
    if token:
        # Test endpoints
        test_endpoints(token)
    
    print("\n" + "=" * 60)
    print("DEBUG COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())