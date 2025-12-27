from typing import Optional
from app.models.base import BaseDBModel

class VendorModel(BaseDBModel):
    name: str
    phone: str
    email: Optional[str] = ""
    address: Optional[str] = ""
    notes: Optional[str] = ""

    class Config:
        populate_by_name = True
