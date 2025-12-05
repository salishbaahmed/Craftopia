"""
Password Handler - Using bcrypt directly for better compatibility
SRP: Responsible ONLY for password hashing and verification
"""
import bcrypt


class PasswordHandler:
    """
    Handles password hashing and verification using bcrypt directly
    SRP: Single responsibility - password security operations
    """
    
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash a plain text password
        """
        # Convert password to bytes
        password_bytes = password.encode('utf-8')
        
        # Generate salt and hash
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password_bytes, salt)
        
        # Return as string
        return hashed.decode('utf-8')
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        try:
            # Convert to bytes
            password_bytes = plain_password.encode('utf-8')
            hashed_bytes = hashed_password.encode('utf-8')
            
            # Verify
            return bcrypt.checkpw(password_bytes, hashed_bytes)
        except Exception as e:
            print(f"Password verification error: {e}")
            return False