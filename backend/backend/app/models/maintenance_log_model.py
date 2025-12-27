from datetime import datetime
from typing import Optional
from pydantic import Field
from app.models.base import BaseDBModel, PyObjectId

class MaintenanceLogModel(BaseDBModel):
    assetId: PyObjectId
    scheduleId: PyObjectId
    performedDate: datetime
    description: str
    cost: float
    vendorId: PyObjectId
    invoiceUrl: Optional[str] = ""
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
