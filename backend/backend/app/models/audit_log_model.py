from datetime import datetime
from pydantic import Field
from app.models.base import BaseDBModel, PyObjectId

class AuditLogModel(BaseDBModel):
    userId: PyObjectId
    action: str
    entityId: PyObjectId
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
