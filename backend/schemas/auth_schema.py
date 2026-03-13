from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    """Base user schema"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr


class UserSignup(UserBase):
    """User signup request"""
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    """User login request"""
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """User response (for API returns)"""
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ForgotPasswordRequest(BaseModel):
    """Forgot password request"""
    email: EmailStr


class TokenResponse(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
