from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.maintenance_schema import MaintenanceScheduleResponse, MaintenanceScheduleCreate, MaintenanceScheduleUpdate, MaintenanceLogResponse, MaintenanceLogCreate
from app.services import maintenance_service
from app.middlewares.auth_middleware import get_current_user

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])

# --- Schedules ---

@router.get("/schedules", response_model=List[MaintenanceScheduleResponse], dependencies=[Depends(get_current_user)])
async def read_schedules():
    return await maintenance_service.get_all_schedules()

@router.post("/schedules", response_model=MaintenanceScheduleResponse, dependencies=[Depends(get_current_user)])
async def create_schedule(schedule_in: MaintenanceScheduleCreate):
    schedule = await maintenance_service.create_schedule(schedule_in)
    if not schedule:
        raise HTTPException(status_code=400, detail="Invalid data (check assetId/vendorId)")
    return schedule

@router.put("/schedules/{schedule_id}", response_model=MaintenanceScheduleResponse, dependencies=[Depends(get_current_user)])
async def update_schedule(schedule_id: str, schedule_in: MaintenanceScheduleUpdate):
    schedule = await maintenance_service.update_schedule(schedule_id, schedule_in)
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found or invalid data")
    return schedule

@router.delete("/schedules/{schedule_id}", dependencies=[Depends(get_current_user)])
async def delete_schedule(schedule_id: str):
    success = await maintenance_service.delete_schedule(schedule_id)
    if not success:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return {"message": "Schedule deleted"}

# --- Logs ---

@router.get("/logs", response_model=List[MaintenanceLogResponse], dependencies=[Depends(get_current_user)])
async def read_logs():
    return await maintenance_service.get_all_logs()

@router.post("/logs", response_model=MaintenanceLogResponse, dependencies=[Depends(get_current_user)])
async def create_log(log_in: MaintenanceLogCreate):
    log = await maintenance_service.create_log(log_in)
    if not log:
        raise HTTPException(status_code=400, detail="Invalid data (check IDs)")
    return log
