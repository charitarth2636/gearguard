from datetime import datetime
from typing import Optional
from pydantic import Field
from app.models.base import BaseDBModel, PyObjectId

class AssetModel(BaseDBModel):
    name: str
    categoryId: PyObjectId
    modelNumber: str
    serialNumber: str
    purchaseDate: datetime
    warrantyExpiry: datetime
    cost: float
    location: str
    status: str = Field(pattern="^(active|inactive)$")
    notes: Optional[str] = ""
    createdBy: PyObjectId
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
