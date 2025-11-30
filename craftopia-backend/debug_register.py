import asyncio
from app.database import init_db, get_session
from app.models.user import User
from sqlmodel import select

async def debug_register():
    print("Initializing database...")
    await init_db()
    
    print("Testing User creation...")
    async for session in get_session():
        try:
            # Simulate registration
            new_user = User(
                firstName="Debug",
                lastName="User",
                email="debug@example.com",
                password="hashedpassword"
            )
            print(f"User object created: {new_user}")
<<<<<<< HEAD
            # addresses is a list, not a relationship in the same way for this debug
=======
>>>>>>> ee2a075f6c6f9171a3591b34687f5442b9e58c40
            print(f"Addresses: {new_user.addresses}")
            
            session.add(new_user)
            await session.commit()
            await session.refresh(new_user)
            print(f"User saved successfully: {new_user.id}")
            
            # Clean up
            await session.delete(new_user)
            await session.commit()
            
        except Exception as e:
            print(f"Error creating user: {e}")
            import traceback
            traceback.print_exc()
        finally:
            break

if __name__ == "__main__":
    asyncio.run(debug_register())
