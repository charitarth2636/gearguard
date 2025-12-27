from typing import Any
from pydantic import BaseModel, BeforeValidator, Field
from typing_extensions import Annotated

# Helper to handle MongoDB ObjectId
PyObjectId = Annotated[str, BeforeValidator(str)]

class BaseDBModel(BaseModel):
    id: PyObjectId = Field(default=None, alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            # Add ObjectId encoder if needed, but string conversion usually handles it
        }
