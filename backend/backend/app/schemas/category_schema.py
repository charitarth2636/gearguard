from pydantic import BaseModel, Field
from typing import Optional

class CategoryBase(BaseModel):
    name: str
    type: str

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None

class CategoryResponse(CategoryBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True
        from_attributes = True
