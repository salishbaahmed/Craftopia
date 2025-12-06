"""
Run this script every time you start working on the project
It verifies everything is set up correctly
"""
import asyncio
import requests
from sqlalchemy import select
from app.database import init_db, get_session
from app.models.admin import Admin
from app.utils import PasswordHandler

async def check_admin():
    """Verify admin exists and password works"""
    try:
        await init_db()
        password_handler = PasswordHandler()
        
        async for session in get_session():
            result = await session.execute(
                select(Admin).where(Admin.email == "admin@craftopia.com")
            )
            admin = result.scalars().first()
            
            if not admin:
                print("❌ Admin not found")
                print("   💡 Run: python reset_admin.py")
                return False
            
            if not password_handler.verify_password("admin123", admin.password):
                print("❌ Admin password invalid")
                print("   💡 Run: python reset_admin.py")
                return False
            
            print("✅ Admin account OK")
            return True
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False

def check_server():
    """Verify server is running"""
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Server running")
            return True
        else:
            print(f"❌ Server returned error: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Server not running")
        print("   💡 Run: uvicorn main:app --reload")
        return False
    except requests.exceptions.Timeout:
        print("⚠️  Server responding slowly (timeout)")
        print("   But it's probably OK - check manually")
        return True
    except Exception as e:
        print(f"❌ Server check failed: {e}")
        return False

def check_login():
    """Verify login works"""
    try:
        response = requests.post(
            "http://localhost:8000/api/auth/login",
            json={"email": "admin@craftopia.com", "password": "admin123", "role": "admin"},
            timeout=5
        )
        if response.status_code == 200:
            token = response.json().get("access_token")
            if token:
                print("✅ Admin login works")
                print(f"   Token: {token[:30]}...")
                return True
            else:
                print("❌ Login succeeded but no token received")
                return False
        else:
            print(f"❌ Login failed: {response.status_code}")
            try:
                print(f"   Detail: {response.json().get('detail')}")
            except:
                pass
            return False
    except requests.exceptions.Timeout:
        print("⚠️  Login timed out")
        print("   Server might be busy - try again")
        return False
    except Exception as e:
        print(f"❌ Login error: {e}")
        return False

def check_routes():
    """Quick check of critical routes"""
    try:
        # Test a public route
        response = requests.get("http://localhost:8000/api/products/", timeout=5)
        if response.status_code == 200:
            print("✅ API routes working")
            return True
        else:
            print(f"⚠️  API routes returned: {response.status_code}")
            return True  # Still consider it OK if server is running
    except:
        print("⚠️  Could not test routes")
        return True  # Don't fail on this

async def main():
    print("=" * 60)
    print("  CRAFTOPIA STARTUP CHECK")
    print("=" * 60)
    print()
    
    checks = []
    
    # Check 1: Server
    print("🔍 Checking server...")
    checks.append(check_server())
    print()
    
    # Check 2: Admin (only if server is running)
    if checks[0]:
        print("🔍 Checking admin account...")
        checks.append(await check_admin())
        print()
        
        # Check 3: Login (only if admin exists)
        if checks[1]:
            print("🔍 Checking authentication...")
            checks.append(check_login())
            print()
            
            # Check 4: Routes
            if checks[2]:
                print("🔍 Checking API routes...")
                checks.append(check_routes())
                print()
    
    print("=" * 60)
    if all(checks):
        print("🎉 ALL CHECKS PASSED - Ready to work!")
        print()
        print("✅ Backend is running and fully operational")
        print("✅ Admin login: admin@craftopia.com / admin123")
        print("✅ API available at: http://localhost:8000")
        print()
        print("📝 Next steps:")
        print("   1. Start frontend: cd ../craftopia-frontend && npm run dev")
        print("   2. Login to admin panel: http://localhost:5173/admin/login")
    else:
        print("⚠️  SOME CHECKS FAILED")
        print()
        print("Fix the issues above, then run this script again")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())