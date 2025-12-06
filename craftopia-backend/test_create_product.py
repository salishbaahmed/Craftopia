import requests
import json

def test_create_product():
    """Test creating a product with proper admin authentication"""
    
    # Step 1: Login as admin first
    print("=" * 60)
    print("STEP 1: Logging in as admin...")
    print("=" * 60)
    
    login_url = "http://localhost:8000/api/auth/login"
    login_data = {
        "email": "admin@craftopia.com",
        "password": "admin123",
        "role": "admin"
    }
    
    try:
        login_response = requests.post(login_url, json=login_data)
        print(f"Login Status: {login_response.status_code}")
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.text}")
            return
        
        token_data = login_response.json()
        access_token = token_data.get("access_token")
        print(f"✅ Login successful!")
        print(f"Token: {access_token[:50]}...")
        
    except Exception as e:
        print(f"❌ Login error: {e}")
        return
    
    # Step 2: Create a product
    print("\n" + "=" * 60)
    print("STEP 2: Creating product...")
    print("=" * 60)
    
    product_url = "http://localhost:8000/api/products/"
    
    # Correct product payload matching your model
    product_data = {
        "name": "Handmade Ceramic Mug",
        "description": "Beautiful handcrafted ceramic mug with unique glaze pattern",
        "price": 25.99,
        "category": "Ceramics",
        "stock": 10,
        "images": [
            "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500"
        ],
        "tags": ["handmade", "ceramic", "kitchen"],
        "materials": "High-quality ceramic clay with food-safe glaze",
        "dimensions": "10cm height x 8cm diameter",
        "weight": 0.3,
        "careInstructions": "Dishwasher safe, microwave safe",
        "artistStory": "Crafted by local artisan John Doe with 10 years of experience",
        "limitedEdition": False
    }
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    print(f"URL: {product_url}")
    print(f"Headers: Authorization: Bearer {access_token[:30]}...")
    print(f"Payload:")
    print(json.dumps(product_data, indent=2))
    
    try:
        response = requests.post(product_url, json=product_data, headers=headers)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code in [200, 201]:
            print("\n✅ Product created successfully!")
        else:
            print("\n❌ Product creation failed!")
            
            # If 422, show validation errors
            if response.status_code == 422:
                print("\n🔍 Validation Errors:")
                errors = response.json().get("detail", [])
                for error in errors:
                    print(f"  - Field: {error.get('loc')}")
                    print(f"    Error: {error.get('msg')}")
                    print(f"    Type: {error.get('type')}")
                    
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_create_product()