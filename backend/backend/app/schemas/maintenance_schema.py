from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# --- Schedule Schemas ---

class MaintenanceScheduleBase(BaseModel):
    assetId: str
    maintenanceType: str
    frequency: str
    nextDate: datetime
    reminderDays: int
    vendorId: str
    estimatedCost: float
    status: str

class MaintenanceScheduleCreate(MaintenanceScheduleBase):
    pass

class MaintenanceScheduleUpdate(BaseModel):
    assetId: Optional[str] = None
    maintenanceType: Optional[str] = None
    frequency: Optional[str] = None
    nextDate: Optional[datetime] = None
    reminderDays: Optional[int] = None
    vendorId: Optional[str] = None
    estimatedCost: Optional[float] = None
    status: Optional[str] = None

class MaintenanceScheduleResponse(MaintenanceScheduleBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
        from_attributes = True

# --- Log Schemas ---

class MaintenanceLogBase(BaseModel):
    assetId: str
    scheduleId: str
    performedDate: datetime
    description: str
    cost: float
    vendorId: str
    invoiceUrl: Optional[str] = ""

class MaintenanceLogCreate(MaintenanceLogBase):
    pass

class MaintenanceLogUpdate(BaseModel):
    assetId: Optional[str] = None
    scheduleId: Optional[str] = None
    performedDate: Optional[datetime] = None
    description: Optional[str] = None
    cost: Optional[float] = None
    vendorId: Optional[str] = None
    invoiceUrl: Optional[str] = None

class MaintenanceLogResponse(MaintenanceLogBase):
    id: str = Field(alias="_id")
    createdAt: datetime

    class Config:
        populate_by_name = True
        from_attributes = True
