import asyncio
from app.database import init_db, get_session
from app.models.admin import Admin
from app.utils import PasswordHandler
from sqlalchemy import select

async def debug_login():
    print("=" * 60)
    print("    CRAFTOPIA ADMIN DEBUGGER")
    print("=" * 60)
    
    await init_db()
    password_handler = PasswordHandler()
    
    async for session in get_session():
        try:
            # Get the admin user
            result = await session.execute(
                select(Admin).where(Admin.email == "admin@craftopia.com")
            )
            admin = result.scalars().first()
            
            if not admin:
                print("\n❌ Admin user not found in database!")
                print("\n💡 Run: python create_admin.py")
                break
            
            print("\n✅ Admin found in database")
            print("━" * 60)
            print(f"🆔 ID:         {admin.id}")
            print(f"📧 Email:      {admin.email}")
            print(f"👤 Name:       {admin.firstName} {admin.lastName}")
            print(f"📅 Created:    {admin.createdAt}")
            print(f"🔐 Hash:       {admin.password[:60]}...")
            print(f"📏 Hash Length: {len(admin.password)}")
            print("━" * 60)
            
            # Test password verification
            test_password = "admin123"
            print(f"\n🔐 Testing password: '{test_password}'")
            
            is_valid = password_handler.verify_password(test_password, admin.password)
            print(f"   Result: {is_valid}")
            
            if is_valid:
                print("\n✅ Password verification PASSED")
                print("\n📋 Login credentials:")
                print("   Email:    admin@craftopia.com")
                print("   Password: admin123")
                print("\n🌐 You can login at: http://localhost:5173/admin/login")
            else:
                print("\n❌ Password verification FAILED")
                print("\n🔍 Debugging hash...")
                
                # Create a new hash and test it
                new_hash = password_handler.hash_password(test_password)
                print(f"   New hash: {new_hash[:60]}...")
                print(f"   New hash length: {len(new_hash)}")
                
                is_new_valid = password_handler.verify_password(test_password, new_hash)
                print(f"   New hash verification: {is_new_valid}")
                
                if is_new_valid:
                    print("\n🔧 The new hash works! Your database has a corrupted hash.")
                    print("💡 Solution: Run 'python reset_admin.py' to fix it")
                else:
                    print("\n⚠️  Even new hash doesn't work. Check PasswordHandler implementation.")
                
        except Exception as e:
            print(f"\n❌ Error: {e}")
            import traceback
            traceback.print_exc()
        finally:
            break

if __name__ == "__main__":
    asyncio.run(debug_login())