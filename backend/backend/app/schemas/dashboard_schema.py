from pydantic import BaseModel
from typing import List

class DashboardStats(BaseModel):
    totalAssets: int
    activeAssets: int
    maintenanceupcoming: int
    maintenanceOverdue: int
    # recentActivity could be added later
