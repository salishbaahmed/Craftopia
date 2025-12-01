import asyncio
import requests
import json

# Test admin login
def test_admin_login():
    url = "http://localhost:8000/api/auth/login"
    
    payload = {
        "email": "admin@craftopia.com",
        "password": "admin123",
        "role": "admin"
    }
    
    print("Testing admin login...")
    print(f"URL: {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(url, json=payload)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("\n✓ Admin login successful!")
            return True
        else:
            print("\n✗ Admin login failed!")
            return False
    except Exception as e:
        print(f"\n✗ Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_admin_login()
