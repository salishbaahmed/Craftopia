"""
Test Orders Flow - Complete test of order creation and retrieval
"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_order_flow():
    print("=" * 60)
    print("TESTING ORDER FLOW")
    print("=" * 60)
    
    # Step 1: Register a new test user
    print("\n[1/5] Registering test user...")
    register_data = {
        "firstName": "Test",
        "lastName": "User",
        "email": f"testuser{hash('test')}@example.com",
        "password": "testpass123"
    }
    
    try:
        register_response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        if register_response.status_code == 200:
            token = register_response.json()["access_token"]
            print(f"✓ User registered, token: {token[:20]}...")
        else:
            print(f"✗ Registration failed: {register_response.status_code}")
            print(f"Response: {register_response.text}")
            return
    except Exception as e:
        print(f"✗ Registration error: {e}")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Step 2: Create an order
    print("\n[2/5] Creating order...")
    order_data = {
        "items": [
            {
                "productId": "123",
                "name": "Test Product",
                "price": 100.0,
                "quantity": 2,
                "imageUrl": "https://example.com/image.jpg"
            }
        ],
        "shippingAddress": {
            "street": "123 Test St",
            "city": "Lahore",
            "state": "Punjab",
            "zipCode": "54000",
            "country": "Pakistan",
            "phone": "+92 300 1234567"
        },
        "subtotal": 200.0,
        "discount": 20.0,
        "tax": 9.0,
        "total": 189.0,
        "paymentStatus": "Completed"
    }
    
    try:
        create_response = requests.post(f"{BASE_URL}/orders", json=order_data, headers=headers)
        if create_response.status_code == 200:
            order = create_response.json()
            order_id = order["id"]
            print(f"✓ Order created: {order_id}")
            print(f"  Customer: {order.get('customerName', 'N/A')}")
            print(f"  Total: Rs {order.get('total', 0)}")
            print(f"  Items: {len(order.get('items', []))}")
        else:
            print(f"✗ Order creation failed: {create_response.status_code}")
            print(f"Response: {create_response.text}")
            return
    except Exception as e:
        print(f"✗ Order creation error: {e}")
        return
    
    # Step 3: Get user orders
    print("\n[3/5] Fetching user orders...")
    try:
        orders_response = requests.get(f"{BASE_URL}/orders", headers=headers)
        if orders_response.status_code == 200:
            orders = orders_response.json()
            print(f"✓ Found {len(orders)} order(s)")
            for order in orders:
                print(f"  - Order {order['id']}: {order.get('status')} - Rs {order.get('total')}")
        else:
            print(f"✗ Failed to get orders: {orders_response.status_code}")
            print(f"Response: {orders_response.text}")
    except Exception as e:
        print(f"✗ Get orders error: {e}")
    
    # Step 4: Get specific order
    print(f"\n[4/5] Fetching order {order_id}...")
    try:
        order_response = requests.get(f"{BASE_URL}/orders/{order_id}", headers=headers)
        if order_response.status_code == 200:
            order_details = order_response.json()
            print(f"✓ Order details retrieved")
            print(f"  Status: {order_details.get('status')}")
            print(f"  Items: {len(order_details.get('items', []))}")
        else:
            print(f"✗ Failed to get order: {order_response.status_code}")
    except Exception as e:
        print(f"✗ Get order error: {e}")
    
    # Step 5: Test admin view (need admin login first)
    print("\n[5/5] Testing admin view...")
    admin_login_data = {
        "email": "admin@craftopia.com",
        "password": "admin123",
        "role": "admin"
    }
    
    try:
        admin_login_response = requests.post(f"{BASE_URL}/auth/login", json=admin_login_data)
        if admin_login_response.status_code == 200:
            admin_token = admin_login_response.json()["access_token"]
            admin_headers = {"Authorization": f"Bearer {admin_token}"}
            
            all_orders_response = requests.get(f"{BASE_URL}/orders/admin/all", headers=admin_headers)
            if all_orders_response.status_code == 200:
                all_orders = all_orders_response.json()
                print(f"✓ Admin can see {len(all_orders)} total order(s)")
            else:
                print(f"✗ Admin get orders failed: {all_orders_response.status_code}")
        else:
            print(f"✗ Admin login failed: {admin_login_response.status_code}")
            print("  Make sure admin exists: python create_admin.py")
    except Exception as e:
        print(f"✗ Admin test error: {e}")
    
    print("\n" + "=" * 60)
    print("TEST COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    test_order_flow()