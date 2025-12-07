import requests
import json
import time

def test_order_flow():
    print("=" * 70)
    print("TESTING ORDER CREATION AND ADMIN VIEW")
    print("=" * 70)
    
    base_url = "http://localhost:8000"
    
    # Step 1: Register a customer
    print("\n1. Registering customer...")
    unique_id = int(time.time() * 1000) % 100000
    customer_data = {
        "firstName": "Test",
        "lastName": "Customer",
        "email": f"customer{unique_id}@example.com",
        "password": "test123"
    }
    
    register_response = requests.post(
        f"{base_url}/api/auth/register/",
        json=customer_data
    )
    
    if register_response.status_code != 200:
        print(f"❌ Customer registration failed: {register_response.status_code}")
        print(register_response.text)
        return
    
    customer_token = register_response.json()["access_token"]
    print(f"✅ Customer registered: {customer_data['email']}")
    
    # Step 2: Create an order as customer
    print("\n2. Creating order as customer...")
    order_data = {
        "items": [
            {
                "productId": "test-product-1",
                "name": "Test Product",
                "price": 29.99,
                "quantity": 2,
                "imageUrl": "https://via.placeholder.com/300"
            }
        ],
        "shippingAddress": {
            "street": "123 Test St",
            "city": "Test City",
            "state": "TS",
            "zipCode": "12345",
            "country": "Test Country"
        },
        "subtotal": 59.98,
        "discount": 0,
        "tax": 5.99,
        "total": 65.97,
        "paymentStatus": "Paid"
    }
    
    create_order_response = requests.post(
        f"{base_url}/api/orders/",
        json=order_data,
        headers={"Authorization": f"Bearer {customer_token}"}
    )
    
    print(f"   Status: {create_order_response.status_code}")
    if create_order_response.status_code in [200, 201]:
        order = create_order_response.json()
        order_id = order["id"]
        print(f"✅ Order created: {order_id}")
        print(f"   Total: ${order['total']}")
        print(f"   Items: {len(order.get('items', []))}")
    else:
        print(f"❌ Order creation failed")
        print(create_order_response.text)
        return
    
    # Step 3: Login as admin
    print("\n3. Logging in as admin...")
    admin_login = requests.post(
        f"{base_url}/api/auth/login/",
        json={"email": "admin@craftopia.com", "password": "admin123", "role": "admin"}
    )
    
    if admin_login.status_code != 200:
        print(f"❌ Admin login failed")
        return
    
    admin_token = admin_login.json()["access_token"]
    print(f"✅ Admin logged in")
    
    # Step 4: Get all orders as admin
    print("\n4. Fetching all orders as admin...")
    all_orders_response = requests.get(
        f"{base_url}/api/orders/admin/all/",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    
    print(f"   Status: {all_orders_response.status_code}")
    if all_orders_response.status_code == 200:
        all_orders = all_orders_response.json()
        print(f"✅ Found {len(all_orders)} total orders")
        
        # Find our order
        our_order = next((o for o in all_orders if o['id'] == order_id), None)
        if our_order:
            print(f"✅ Our order is visible to admin!")
            print(f"   Order ID: {our_order['id']}")
            print(f"   Total: ${our_order['total']}")
            print(f"   Items: {len(our_order.get('items', []))}")
        else:
            print(f"❌ Our order is NOT visible to admin!")
            print(f"   Looking for: {order_id}")
            print(f"   Available orders: {[o['id'] for o in all_orders]}")
    else:
        print(f"❌ Failed to fetch orders as admin")
        print(all_orders_response.text)
    
    # Step 5: Check customer can see their orders
    print("\n5. Fetching customer's orders...")
    customer_orders_response = requests.get(
        f"{base_url}/api/orders/",
        headers={"Authorization": f"Bearer {customer_token}"}
    )
    
    print(f"   Status: {customer_orders_response.status_code}")
    if customer_orders_response.status_code == 200:
        customer_orders = customer_orders_response.json()
        print(f"✅ Customer sees {len(customer_orders)} orders")
    else:
        print(f"❌ Customer can't fetch orders")
    
    print("\n" + "=" * 70)
    print("TEST COMPLETE")
    print("=" * 70)

if __name__ == "__main__":
    test_order_flow()