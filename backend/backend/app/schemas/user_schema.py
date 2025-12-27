from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "user"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    password: Optional[str] = None
    isVerified: Optional[bool] = None

class UserResponse(UserBase):
    id: str = Field(alias="_id")
    isVerified: bool
    createdAt: datetime

    class Config:
        populate_by_name = True
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str
