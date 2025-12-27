from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any

class ReportRequest(BaseModel):
    type: str # 'maintenance', 'asset_cost', etc.
    startDate: Optional[datetime] = None
    endDate: Optional[datetime] = None

class ReportResponse(BaseModel):
    reportId: str
    status: str
    data: Any
    generatedAt: datetime
