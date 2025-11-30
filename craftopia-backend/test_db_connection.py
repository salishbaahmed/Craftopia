import asyncio
from app.database import init_db, get_session
from app.models.user import User
from sqlmodel import select

async def test_connection():
    print("Initializing database...")
    try:
        await init_db()
        print("Database initialized successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")
        return

    print("Testing CRUD operations...")
    async for session in get_session():
        try:
            # Create User
            print("Creating user...")
            new_user = User(
                firstName="Test",
                lastName="User",
                email="test@example.com",
                password="hashedpassword"
            )
            session.add(new_user)
            await session.commit()
            await session.refresh(new_user)
            print(f"User created: {new_user.id} - {new_user.email}")

            # Read User
            print("Reading user...")
            result = await session.exec(select(User).where(User.email == "test@example.com"))
            user = result.first()
            if user:
                print(f"User found: {user.firstName} {user.lastName}")
            else:
                print("User not found!")

            # Clean up
            print("Cleaning up...")
            await session.delete(user)
            await session.commit()
            print("User deleted.")
            
        except Exception as e:
            print(f"Error during CRUD: {e}")
            # If error is unique constraint, it might be because user already exists from previous run
            if "unique constraint" in str(e).lower():
                 print("User likely already exists.")
        finally:
            break

if __name__ == "__main__":
    asyncio.run(test_connection())
