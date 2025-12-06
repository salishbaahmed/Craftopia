import requests
import json
import time
import random

def test_route(method, url, data=None, headers=None):
    """Test a single route and return status code"""
    try:
        if method == 'GET':
            response = requests.get(url, headers=headers)
        elif method == 'POST':
            response = requests.post(url, json=data, headers=headers)
        return response.status_code, response
    except Exception as e:
        return f"ERROR: {e}", None

def main():
    print("=" * 70)
    print("CRAFTOPIA API ROUTE VERIFICATION")
    print("=" * 70)
    
    base_url = "http://localhost:8000"
    
    # Test data
    login_data = {
        "email": "admin@craftopia.com",
        "password": "admin123",
        "role": "admin"
    }
    
    # Use unique email for registration tests
    unique_id = int(time.time() * 1000) % 100000
    register_data_1 = {
        "firstName": "Test",
        "lastName": "User",
        "email": f"test{unique_id}@example.com",
        "password": "test123"
    }
    
    register_data_2 = {
        "firstName": "Test",
        "lastName": "User",
        "email": f"test{unique_id + 1}@example.com",
        "password": "test123"
    }
    
    # Test routes with and without trailing slashes
    routes_to_test = [
        # Auth routes
        ("POST", "/api/auth/login", login_data, None, "Login (no slash)", [200]),
        ("POST", "/api/auth/login/", login_data, None, "Login (with slash)", [200]),
        ("POST", "/api/auth/register", register_data_1, None, "Register (no slash)", [200]),
        ("POST", "/api/auth/register/", register_data_2, None, "Register (with slash)", [200]),
    ]
    
    # First, get a token
    print("\n📋 Getting admin token...")
    status, login_response = test_route("POST", f"{base_url}/api/auth/login", login_data)
    
    if status == 200:
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print(f"✅ Token obtained: {token[:30]}...")
        
        # Add authenticated routes
        product_data_1 = {
            "name": f"Test Product {unique_id}",
            "description": "Test",
            "price": 10.0,
            "category": "Test",
            "stock": 5,
            "images": []
        }
        
        product_data_2 = {
            "name": f"Test Product {unique_id + 1}",
            "description": "Test",
            "price": 10.0,
            "category": "Test",
            "stock": 5,
            "images": []
        }
        
        routes_to_test.extend([
            ("GET", "/api/products", None, None, "Get products (no slash, public)", [200]),
            ("GET", "/api/products/", None, None, "Get products (with slash, public)", [200]),
            ("POST", "/api/products", product_data_1, headers, "Create product (no slash, admin)", [200, 201]),
            ("POST", "/api/products/", product_data_2, headers, "Create product (with slash, admin)", [200, 201]),
            ("GET", "/api/orders/admin/all", None, headers, "Get all orders (no slash, admin)", [200]),
            ("GET", "/api/orders/admin/all/", None, headers, "Get all orders (with slash, admin)", [200]),
        ])
    else:
        print(f"❌ Failed to get token: {status}")
        headers = None
    
    # Test all routes
    print("\n" + "=" * 70)
    print("ROUTE TESTS")
    print("=" * 70)
    
    results = {
        "pass": [],
        "fail": []
    }
    
    for method, endpoint, data, req_headers, description, expected_codes in routes_to_test:
        url = f"{base_url}{endpoint}"
        status, response = test_route(method, url, data, req_headers)
        
        # Determine if test passed
        if status in expected_codes:
            status_icon = "✅"
            results["pass"].append(description)
        else:
            status_icon = "❌"
            error_detail = ""
            if response:
                try:
                    error_detail = f" - {response.json().get('detail', '')}"
                except:
                    pass
            results["fail"].append((description, status, error_detail))
        
        print(f"{status_icon} [{method:4}] {endpoint:30} {status:3} - {description}")
    
    # Summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"✅ Passed: {len(results['pass'])}/{len(routes_to_test)}")
    print(f"❌ Failed: {len(results['fail'])}/{len(routes_to_test)}")
    
    if results['fail']:
        print("\n⚠️  Failed routes:")
        for desc, status, detail in results['fail']:
            print(f"   - {desc}: {status}{detail}")
        print("\n💡 Common issues:")
        print("   - 404: Route not defined (missing decorator)")
        print("   - 401/403: Authentication issue")
        print("   - 400: Validation error or duplicate data")
        print("\n💡 Solution: Make sure all routers have both decorators:")
        print("   @router.post('/endpoint')")
        print("   @router.post('/endpoint/')")
    else:
        print("\n🎉 ALL ROUTES WORKING PERFECTLY!")
        print("✅ Both with and without trailing slashes work")
        print("✅ Authentication is working")
        print("✅ Your API is ready to use")

if __name__ == "__main__":
    main()