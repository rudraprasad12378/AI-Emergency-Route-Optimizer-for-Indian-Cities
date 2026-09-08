from datetime import datetime, timedelta, timezone
from typing import Any, Optional, Union, Dict
from jose import JWTError, jwt
import bcrypt
from app.core.config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against hashed password using bcrypt."""
    try:
        password_bytes = plain_password.encode('utf-8')
        hash_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hash_bytes)
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    """Generate bcrypt password hash."""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password_bytes, salt).decode('utf-8')


def create_access_token(
    subject: Union[str, Dict[str, Any]],
    role: Optional[str] = None,
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create signed JWT access token supporting both dict and explicit subject/role arguments."""
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    if isinstance(subject, dict):
        to_encode = subject.copy()
        if "exp" not in to_encode:
            to_encode["exp"] = expire
        if "iat" not in to_encode:
            to_encode["iat"] = now
    else:
        to_encode = {
            "exp": expire,
            "sub": str(subject),
            "role": role or "CITIZEN",
            "iat": now
        }
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate JWT access token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
