from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AssetBase(BaseModel):
    name: str
    categoryId: str
    modelNumber: str
    serialNumber: str
    purchaseDate: datetime
    warrantyExpiry: datetime
    cost: float
    location: str
    status: str
    notes: Optional[str] = ""

class AssetCreate(AssetBase):
    pass

class AssetUpdate(BaseModel):
    name: Optional[str] = None
    categoryId: Optional[str] = None
    modelNumber: Optional[str] = None
    serialNumber: Optional[str] = None
    purchaseDate: Optional[datetime] = None
    warrantyExpiry: Optional[datetime] = None
    cost: Optional[float] = None
    location: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class AssetResponse(AssetBase):
    id: str = Field(alias="_id")
    createdBy: str
    createdAt: datetime

    class Config:
        populate_by_name = True
        from_attributes = True
