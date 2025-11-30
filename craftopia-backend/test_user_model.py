from app.models.user import User, Address
try:
    user = User(
        firstName="Test",
        lastName="User",
        email="test@example.com",
        password="password"
    )
    print("User created successfully")
except Exception as e:
    print(f"Error: {e}")
