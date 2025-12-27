from datetime import datetime
from pydantic import Field
from app.models.base import BaseDBModel, PyObjectId

class NotificationModel(BaseDBModel):
    userId: PyObjectId
    type: str = Field(pattern="^(maintenance|warranty)$")
    message: str
    isRead: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
