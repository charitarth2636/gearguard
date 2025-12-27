from app.database.collections import maintenance_schedules_collection, maintenance_logs_collection, assets_collection, vendors_collection
from app.models.maintenance_model import MaintenanceScheduleModel
from app.models.maintenance_log_model import MaintenanceLogModel
from app.schemas.maintenance_schema import MaintenanceScheduleCreate, MaintenanceScheduleUpdate, MaintenanceLogCreate, MaintenanceLogUpdate
from bson import ObjectId
from typing import List, Optional
from datetime import datetime

# --- Schedules ---

async def get_all_schedules() -> List[MaintenanceScheduleModel]:
    schedules = await maintenance_schedules_collection().find().to_list(1000)
    return [MaintenanceScheduleModel(**s) for s in schedules]

async def get_schedule_by_id(schedule_id: str) -> Optional[MaintenanceScheduleModel]:
    if not ObjectId.is_valid(schedule_id):
        return None
    s = await maintenance_schedules_collection().find_one({"_id": ObjectId(schedule_id)})
    if s:
        return MaintenanceScheduleModel(**s)
    return None

async def create_schedule(schedule_in: MaintenanceScheduleCreate) -> Optional[MaintenanceScheduleModel]:
    if not ObjectId.is_valid(schedule_in.assetId) or not ObjectId.is_valid(schedule_in.vendorId):
        return None
        
    # Validate Asset and Vendor
    asset = await assets_collection().find_one({"_id": ObjectId(schedule_in.assetId)})
    vendor = await vendors_collection().find_one({"_id": ObjectId(schedule_in.vendorId)})
    if not asset or not vendor:
        return None
        
    s_dict = schedule_in.model_dump()
    db_s = MaintenanceScheduleModel(**s_dict)
    res = await maintenance_schedules_collection().insert_one(db_s.model_dump(by_alias=True, exclude={"id"}))
    created = await maintenance_schedules_collection().find_one({"_id": res.inserted_id})
    return MaintenanceScheduleModel(**created)

async def update_schedule(schedule_id: str, schedule_in: MaintenanceScheduleUpdate) -> Optional[MaintenanceScheduleModel]:
    if not ObjectId.is_valid(schedule_id):
        return None
    
    update_data = schedule_in.model_dump(exclude_unset=True)
    if not update_data:
        return await get_schedule_by_id(schedule_id)
        
    # Validate foreign keys if changed
    if "assetId" in update_data:
        if not await assets_collection().find_one({"_id": ObjectId(update_data["assetId"])}):
             return None
    if "vendorId" in update_data:
        if not await vendors_collection().find_one({"_id": ObjectId(update_data["vendorId"])}):
             return None

    res = await maintenance_schedules_collection().update_one(
        {"_id": ObjectId(schedule_id)}, {"$set": update_data}
    )
    if res.matched_count == 0:
        return None
    return await get_schedule_by_id(schedule_id)

async def delete_schedule(schedule_id: str) -> bool:
    if not ObjectId.is_valid(schedule_id):
        return False
    res = await maintenance_schedules_collection().delete_one({"_id": ObjectId(schedule_id)})
    return res.deleted_count > 0

# --- Logs ---

async def get_all_logs() -> List[MaintenanceLogModel]:
    logs = await maintenance_logs_collection().find().to_list(1000)
    return [MaintenanceLogModel(**l) for l in logs]

async def create_log(log_in: MaintenanceLogCreate) -> Optional[MaintenanceLogModel]:
    # Validate Asset, Schedule, Vendor
    if not (ObjectId.is_valid(log_in.assetId) and ObjectId.is_valid(log_in.scheduleId) and ObjectId.is_valid(log_in.vendorId)):
        return None
        
    if not await assets_collection().find_one({"_id": ObjectId(log_in.assetId)}):
        return None
    if not await maintenance_schedules_collection().find_one({"_id": ObjectId(log_in.scheduleId)}):
        return None
    if not await vendors_collection().find_one({"_id": ObjectId(log_in.vendorId)}):
        return None
        
    log_dict = log_in.model_dump()
    log_dict["createdAt"] = datetime.utcnow()
    db_log = MaintenanceLogModel(**log_dict)
    
    res = await maintenance_logs_collection().insert_one(db_log.model_dump(by_alias=True, exclude={"id"}))
    created = await maintenance_logs_collection().find_one({"_id": res.inserted_id})
    return MaintenanceLogModel(**created)
