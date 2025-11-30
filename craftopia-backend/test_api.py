import requests
import json
import traceback

def test_register():
    url = "http://127.0.0.1:8000/api/auth/register"
    payload = {
        "firstName": "API",
        "lastName": "Test",
        "email": "apitest2@example.com",
        "password": "password123"
    }
    headers = {
        "Content-Type": "application/json"
    }

    print(f"Sending POST request to {url}...")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        print(f"\nStatus Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200 or response.status_code == 201:
            print("\n✓ Success!")
            data = response.json()
            print(f"Access Token: {data.get('access_token', 'N/A')[:50]}...")
        else:
            print(f"\n✗ Failed with status {response.status_code}")
            try:
                error_detail = response.json()
                print(f"Error Detail: {json.dumps(error_detail, indent=2)}")
            except:
                print(f"Raw Error: {response.text}")
            
    except requests.exceptions.ConnectionError as e:
        print(f"\n✗ Connection Error! Is the backend running on {url}?")
        print(f"Error: {e}")
    except requests.exceptions.Timeout:
        print("\n✗ Request timed out!")
    except Exception as e:
        print(f"\n✗ An error occurred: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    test_register()
