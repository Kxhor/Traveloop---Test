"""
jwt_handler.py — JWT Token Utilities

Provides helpers to create and verify JSON Web Tokens for authentication.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt

from app.config.settings import settings


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Generate a signed JWT access token.

    Args:
        data: Payload to encode (typically {"sub": user_id}).
        expires_delta: Custom expiration; defaults to settings value.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.JWT_EXPIRATION_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def verify_access_token(token: str) -> Optional[dict]:
    """
    Decode and verify a JWT token.

    Returns the payload dict on success, or None if invalid/expired.
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None
