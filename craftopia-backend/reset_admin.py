import asyncio
from app.database import init_db, get_session
from app.models.admin import Admin
from app.utils.auth import get_password_hash, verify_password
from sqlalchemy import select, delete

async def reset_admin():
    await init_db()
    
    async for session in get_session():
        # Delete existing admin
        await session.execute(delete(Admin).where(Admin.email == "admin@craftopia.com"))
        await session.commit()
        print("✓ Deleted existing admin (if any)")
        
        # Create new admin with proper password hash
        password = "admin123"
        hashed_password = get_password_hash(password)
        
        print(f"\nCreating new admin...")
        print(f"Password: {password}")
        print(f"Hash: {hashed_password}")
        
        # Verify the hash works BEFORE saving
        verification_test = verify_password(password, hashed_password)
        print(f"Pre-save verification test: {verification_test}")
        
        if not verification_test:
            print("❌ Hash verification failed! Something is wrong with bcrypt.")
            break
        
        admin = Admin(
            email="admin@craftopia.com",
            password=hashed_password,
            firstName="Admin",
            lastName="User"
        )
        
        session.add(admin)
        await session.commit()
        await session.refresh(admin)
        
        print(f"\n✅ Admin created successfully!")
        print(f"Email: {admin.email}")
        print(f"Password: admin123")
        print(f"ID: {admin.id}")
        
        # Verify after saving
        post_save_test = verify_password(password, admin.password)
        print(f"Post-save verification test: {post_save_test}")
        
        if post_save_test:
            print("\n🎉 Everything is working! You can now login with:")
            print("   Email: admin@craftopia.com")
            print("   Password: admin123")
            print("   Role: admin")
        else:
            print("\n❌ Post-save verification failed! Database might be corrupting the hash.")
        
        break

if __name__ == "__main__":
    asyncio.run(reset_admin())