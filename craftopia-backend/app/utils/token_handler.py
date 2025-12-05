"""
Token Handler - Follows Single Responsibility Principle
SRP: Responsible ONLY for JWT token operations
"""
from datetime import datetime, timedelta
from typing import Optional, Dict
from jose import JWTError, jwt
from app.config import settings


class TokenHandler:
    """
    Handles JWT token creation and validation
    SRP: Single responsibility - token operations
    """
    
    def __init__(self, secret_key: str = settings.SECRET_KEY, algorithm: str = settings.ALGORITHM):
        self._secret_key = secret_key
        self._algorithm = algorithm
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create a new JWT access token"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode,
            self._secret_key,
            algorithm=self._algorithm
        )
        return encoded_jwt
    
    def decode_token(self, token: str) -> Dict:
        """Decode and validate JWT token"""
        try:
            payload = jwt.decode(
                token,
                self._secret_key,
                algorithms=[self._algorithm]
            )
            return payload
        except JWTError as e:
            raise ValueError(f"Invalid token: {str(e)}")