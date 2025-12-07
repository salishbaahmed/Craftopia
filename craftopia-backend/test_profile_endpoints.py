import requests
import json
import time

def test_profile_endpoints():
    print("=" * 70)
    print("TESTING USER PROFILE ENDPOINTS")
    print("=" * 70)
    
    base_url = "http://localhost:8000"
    
    # Step 1: Register a new user for testing
    print("\n1. Registering a new test user...")
    unique_id = int(time.time() * 1000) % 100000
    test_user = {
        "firstName": "Test",
        "lastName": "User",
        "email": f"testuser{unique_id}@example.com",
        "password": "test123"
    }
    
    register_response = requests.post(
        f"{base_url}/api/auth/register",
        json=test_user
    )
    
    print(f"   Status: {register_response.status_code}")
    
    if register_response.status_code != 200:
        print(f"❌ Registration failed")
        print(f"   Response: {register_response.text}")
        return
    
    user_token = register_response.json()["access_token"]
    user_role = register_response.json()["role"]
    print(f"✅ Registered user: {test_user['email']}")
    print(f"   Role: {user_role}")
    print(f"   Token: {user_token[:50]}...")
    
    headers = {
        "Authorization": f"Bearer {user_token}",
        "Content-Type": "application/json"
    }
    
    # Test 2: Get /me to verify token works
    print("\n2. Testing /api/auth/me endpoint...")
    me_response = requests.get(f"{base_url}/api/auth/me/", headers=headers)
    print(f"   Status: {me_response.status_code}")
    if me_response.status_code == 200:
        print(f"✅ /me endpoint works")
        print(f"   User: {me_response.json()}")
    else:
        print(f"❌ /me endpoint failed")
        print(f"   Response: {me_response.text}")
    
    # Test 3: Get profile (without slash)
    print("\n3. Getting profile (without slash)...")
    response1 = requests.get(f"{base_url}/api/users/profile", headers=headers)
    print(f"   Status: {response1.status_code}")
    if response1.status_code == 200:
        print(f"✅ GET /profile works")
        print(f"   User: {response1.json()}")
    else:
        print(f"❌ GET /profile failed")
        print(f"   Response: {response1.text}")
    
    # Test 4: Get profile (with slash)
    print("\n4. Getting profile (with slash)...")
    response2 = requests.get(f"{base_url}/api/users/profile/", headers=headers)
    print(f"   Status: {response2.status_code}")
    if response2.status_code == 200:
        print(f"✅ GET /profile/ works")
    else:
        print(f"❌ GET /profile/ failed")
        print(f"   Response: {response2.text}")
    
    # Test 5: Update profile with snake_case (like frontend)
    print("\n5. Updating profile (snake_case like frontend)...")
    update_data = {
        "first_name": "Updated",
        "last_name": "Name",
        "phone_number": "+923001234567"
    }
    
    response3 = requests.put(
        f"{base_url}/api/users/profile/",
        json=update_data,
        headers=headers
    )
    
    print(f"   Status: {response3.status_code}")
    if response3.status_code == 200:
        print(f"✅ Profile updated with snake_case")
        print(f"   Result: {json.dumps(response3.json(), indent=2)}")
    else:
        print(f"❌ Update failed")
        print(f"   Response: {response3.text}")
    
    # Test 6: Update profile with camelCase
    print("\n6. Updating profile (camelCase)...")
    update_data_camel = {
        "firstName": "Updated2",
        "lastName": "Name2",
        "phone": "+923009999999"
    }
    
    response4 = requests.put(
        f"{base_url}/api/users/profile/",
        json=update_data_camel,
        headers=headers
    )
    
    print(f"   Status: {response4.status_code}")
    if response4.status_code == 200:
        print(f"✅ Profile updated with camelCase")
        print(f"   Result: {json.dumps(response4.json(), indent=2)}")
    else:
        print(f"❌ Update failed")
        print(f"   Response: {response4.text}")
    
    # Test 7: Admin login (should still work)
    print("\n7. Testing admin login...")
    admin_login = requests.post(
        f"{base_url}/api/auth/login",
        json={"email": "admin@craftopia.com", "password": "admin123", "role": "admin"}
    )
    
    print(f"   Status: {admin_login.status_code}")
    if admin_login.status_code == 200:
        print(f"✅ Admin login works")
        admin_token = admin_login.json()["access_token"]
        
        # Test 8: Admin trying to access user profile endpoint
        print("\n8. Admin trying to access /users/profile (should fail)...")
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        
        response5 = requests.get(f"{base_url}/api/users/profile/", headers=admin_headers)
        print(f"   Status: {response5.status_code}")
        if response5.status_code == 403:
            print(f"✅ Correctly blocked admin from user endpoint")
        elif response5.status_code == 200:
            print(f"⚠️  Admin was allowed (this might be okay)")
        else:
            print(f"❌ Unexpected status: {response5.status_code}")
    else:
        print(f"❌ Admin login failed")
        print(f"   Response: {admin_login.text}")
    
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print("✓ Test complete - check results above")
    print("=" * 70)

if __name__ == "__main__":
    test_profile_endpoints()