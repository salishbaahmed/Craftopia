import asyncio
from app.database import init_db, get_session
from app.models.admin import Admin
from app.utils import PasswordHandler
from sqlalchemy import select

async def create_admin():
    print("=" * 60)
    print("    CRAFTOPIA ADMIN CREATOR")
    print("=" * 60)
    
    await init_db()
    password_handler = PasswordHandler()
    
    async for session in get_session():
        try:
            # Check if admin already exists
            result = await session.execute(
                select(Admin).where(Admin.email == "admin@craftopia.com")
            )
            existing = result.scalars().first()
            
            if existing:
                print("\n⚠️  Admin already exists!")
                print(f"   Email: {existing.email}")
                print(f"   ID: {existing.id}")
                print(f"   Name: {existing.firstName} {existing.lastName}")
                print("\n💡 To reset password, run: python reset_admin.py")
                break
            
            # Create admin user
            print("\n🔐 Creating admin user...")
            password = "admin123"
            hashed_password = password_handler.hash_password(password)
            
            # Verify hash works
            if not password_handler.verify_password(password, hashed_password):
                print("❌ Password verification failed!")
                break
            
            print("✓ Password hashed and verified successfully")
            
            admin = Admin(
                email="admin@craftopia.com",
                password=hashed_password,
                firstName="Admin",
                lastName="User"
            )
            
            session.add(admin)
            await session.commit()
            await session.refresh(admin)
            
            print("\n✅ Admin created successfully!")
            print("━" * 60)
            print(f"📧 Email:    admin@craftopia.com")
            print(f"🔑 Password: admin123")
            print(f"🆔 ID:       {admin.id}")
            print("━" * 60)
            print(f"\n🌐 Login at: http://localhost:5173/admin/login")
            
        except Exception as e:
            print(f"\n❌ Error: {e}")
            import traceback
            traceback.print_exc()
            await session.rollback()
        finally:
            break

if __name__ == "__main__":
    asyncio.run(create_admin())