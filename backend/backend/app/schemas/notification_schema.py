from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class NotificationBase(BaseModel):
    userId: str
    type: str
    message: str
    isRead: bool = False

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    isRead: Optional[bool] = None

class NotificationResponse(NotificationBase):
    id: str = Field(alias="_id")
    createdAt: datetime

    class Config:
        populate_by_name = True
        from_attributes = True
