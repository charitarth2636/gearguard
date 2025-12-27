from pydantic import BaseModel, Field
from typing import Optional

class VendorBase(BaseModel):
    name: str
    phone: str
    email: Optional[str] = ""
    address: Optional[str] = ""
    notes: Optional[str] = ""

class VendorCreate(VendorBase):
    pass

class VendorUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None

class VendorResponse(VendorBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
        from_attributes = True
