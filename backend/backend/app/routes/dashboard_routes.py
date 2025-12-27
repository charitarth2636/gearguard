from fastapi import APIRouter, Depends
from app.schemas.dashboard_schema import DashboardStats
from app.services import dashboard_service
from app.middlewares.auth_middleware import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStats, dependencies=[Depends(get_current_user)])
async def get_stats():
    return await dashboard_service.get_dashboard_stats()
