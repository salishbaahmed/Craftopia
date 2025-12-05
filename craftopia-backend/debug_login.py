import asyncio
from app.database import init_db, get_session
from app.models.admin import Admin
from app.utils.auth import verify_password, get_password_hash
from sqlalchemy import select

async def debug_login():
    await init_db()
    
    async for session in get_session():
        # Get the admin user
        result = await session.execute(
            select(Admin).where(Admin.email == "admin@craftopia.com")
        )
        admin = result.scalars().first()
        
        if not admin:
            print("❌ Admin user not found in database!")
            print("Run: python create_admin.py")
            break
        
        print("✓ Admin found in database")
        print(f"Email: {admin.email}")
        print(f"Stored password hash: {admin.password}")
        print(f"Hash length: {len(admin.password)}")
        
        # Test password verification
        test_password = "admin123"
        print(f"\nTesting password: '{test_password}'")
        
        try:
            is_valid = verify_password(test_password, admin.password)
            print(f"Password verification result: {is_valid}")
            
            if is_valid:
                print("\n✅ Password verification PASSED")
            else:
                print("\n❌ Password verification FAILED")
                print("\nLet's create a new hash and compare:")
                new_hash = get_password_hash(test_password)
                print(f"New hash: {new_hash}")
                print(f"New hash length: {len(new_hash)}")
                
                # Test the new hash
                is_new_valid = verify_password(test_password, new_hash)
                print(f"New hash verification: {is_new_valid}")
                
                if is_new_valid:
                    print("\n🔧 The new hash works! Your database has a corrupted hash.")
                    print("Solution: Delete the admin and run create_admin.py again")
                
        except Exception as e:
            print(f"\n❌ Error during verification: {e}")
            import traceback
            traceback.print_exc()
        
        break

if __name__ == "__main__":
    asyncio.run(debug_login())