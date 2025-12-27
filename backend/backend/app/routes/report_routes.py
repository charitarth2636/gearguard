from fastapi import APIRouter, Depends
from app.schemas.report_schema import ReportRequest, ReportResponse
from app.services import report_service
from app.middlewares.auth_middleware import get_current_user
from app.middlewares.role_middleware import RoleChecker

router = APIRouter(prefix="/reports", tags=["Reports"])

admin_only = RoleChecker(["admin"])

@router.post("/generate", response_model=ReportResponse, dependencies=[Depends(admin_only)])
async def generate_report(req: ReportRequest):
    return await report_service.generate_report(req)
