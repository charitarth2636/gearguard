from datetime import datetime
from pydantic import Field
from app.models.base import BaseDBModel, PyObjectId

class MaintenanceScheduleModel(BaseDBModel):
    assetId: PyObjectId
    maintenanceType: str
    frequency: str = Field(pattern="^(daily|weekly|monthly|quarterly|yearly)$")
    nextDate: datetime
    reminderDays: int = 3
    vendorId: PyObjectId
    estimatedCost: float
    status: str = Field(pattern="^(upcoming|overdue|completed)$")

    class Config:
        populate_by_name = True
