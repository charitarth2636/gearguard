from pydantic import Field
from app.models.base import BaseDBModel

class CategoryModel(BaseDBModel):
    name: str
    type: str = Field(pattern="^(asset|maintenance)$")

    class Config:
        populate_by_name = True
