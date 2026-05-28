"""
user_schema.py — Pydantic schemas for User endpoints

Defines request bodies, response models, and validation for user-related
API operations (registration, login, profile).
"""

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    """Schema for user registration."""
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema returned after successful auth or profile fetch."""
    id: int
    username: str
    email: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"
