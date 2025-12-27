from app.database.collections import assets_collection, maintenance_schedules_collection, users_collection
from app.schemas.dashboard_schema import DashboardStats
from datetime import datetime

async def get_dashboard_stats() -> DashboardStats:
    total_assets = await assets_collection().count_documents({})
    active_assets = await assets_collection().count_documents({"status": "active"})
    
    # Maintenance stats
    upcoming_maintenance = await maintenance_schedules_collection().count_documents({"status": "upcoming"})
    overdue_maintenance = await maintenance_schedules_collection().count_documents({"status": "overdue"})
    
    return DashboardStats(
        totalAssets=total_assets,
        activeAssets=active_assets,
        maintenanceupcoming=upcoming_maintenance,
        maintenanceOverdue=overdue_maintenance
    )
