import requests
import json

def debug_token():
    """Debug token generation and validation"""
    
    print("=" * 60)
    print("TOKEN DEBUG TOOL")
    print("=" * 60)
    
    # Step 1: Login
    print("\n1. Logging in as admin...")
    login_response = requests.post(
        "http://localhost:8000/api/auth/login",
        json={
            "email": "admin@craftopia.com",
            "password": "admin123",
            "role": "admin"
        }
    )
    
    print(f"Status: {login_response.status_code}")
    
    if login_response.status_code != 200:
        print(f"❌ Login failed")
        print(f"Response: {login_response.text}")
        return
    
    token_data = login_response.json()
    access_token = token_data.get("access_token")
    role = token_data.get("role")
    
    print(f"✅ Login successful")
    print(f"Role: {role}")
    print(f"Token: {access_token[:50]}...")
    
    # Step 2: Test GET products (public endpoint)
    print("\n2. Testing GET /api/products/ (public)...")
    get_response = requests.get("http://localhost:8000/api/products/")
    print(f"Status: {get_response.status_code}")
    
    # Step 3: Test POST with token
    print("\n3. Testing POST /api/products/ (admin only)...")
    
    product_data = {
        "name": "Debug Test Mug",
        "description": "Testing authentication",
        "price": 19.99,
        "category": "Ceramics",
        "stock": 3,
        "images": ["https://via.placeholder.com/300"]
    }
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    print(f"Headers: Authorization: Bearer {access_token[:30]}...")
    print(f"Payload: {json.dumps(product_data, indent=2)}")
    
    post_response = requests.post(
        "http://localhost:8000/api/products/",
        json=product_data,
        headers=headers
    )
    
    print(f"\nStatus: {post_response.status_code}")
    
    try:
        response_json = post_response.json()
        print(f"Response: {json.dumps(response_json, indent=2)}")
    except:
        print(f"Response (text): {post_response.text}")
    
    # Diagnosis
    print("\n" + "=" * 60)
    if post_response.status_code in [200, 201]:
        print("✅ SUCCESS! Product created")
    elif post_response.status_code == 401:
        print("❌ AUTHENTICATION FAILED (401)")
        print("\nPossible causes:")
        print("1. Token decode failing in TokenHandler")
        print("2. AuthService.get_current_user() returning None")
        print("3. Admin not found in database")
        print("4. Role in token is not 'admin'")
        print("\nNext steps:")
        print("- Check app/services/auth_service.py")
        print("- Run: python check_admin.py")
    elif post_response.status_code == 403:
        print("❌ FORBIDDEN (403)")
        print("User is authenticated but not authorized")
        print("Check if isinstance(user, Admin) is failing")
    elif post_response.status_code == 422:
        print("❌ VALIDATION ERROR (422)")
        print("The request data doesn't match the schema")
    else:
        print(f"❌ UNEXPECTED ERROR: {post_response.status_code}")
    print("=" * 60)

if __name__ == "__main__":
    debug_token()