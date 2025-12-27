from datetime import datetime
from pydantic import Field, EmailStr
from app.models.base import BaseDBModel, PyObjectId

class UserModel(BaseDBModel):
    name: str
    email: EmailStr
    password: str
    role: str = Field(default="user", pattern="^(admin|user)$")
    isVerified: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
