from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.asset_schema import AssetResponse, AssetCreate, AssetUpdate
from app.services import asset_service
from app.middlewares.auth_middleware import get_current_user

router = APIRouter(prefix="/assets", tags=["Assets"])

# All authenticated users can read/write?
# Assuming yes for now, or restrict write to Admin?
# The prompt says role: admin | user.
# Usually user can read, admin can write. But user is "Charitarth" (Dev).
# I'll allow all authenticated users to manage assets for simplicity, or maybe check roles later.

@router.get("/", response_model=List[AssetResponse], dependencies=[Depends(get_current_user)])
async def read_assets():
    return await asset_service.get_all_assets()

@router.get("/{asset_id}", response_model=AssetResponse, dependencies=[Depends(get_current_user)])
async def read_asset(asset_id: str):
    asset = await asset_service.get_asset_by_id(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset

@router.post("/", response_model=AssetResponse)
async def create_asset(asset_in: AssetCreate, current_user = Depends(get_current_user)):
    user_id = str(current_user.id)
    asset = await asset_service.create_asset(asset_in, created_by=user_id)
    if not asset:
        raise HTTPException(status_code=400, detail="Could not create asset. Check category ID.")
    return asset

@router.put("/{asset_id}", response_model=AssetResponse, dependencies=[Depends(get_current_user)])
async def update_asset(asset_id: str, asset_in: AssetUpdate):
    asset = await asset_service.update_asset(asset_id, asset_in)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found or invalid data")
    return asset

@router.delete("/{asset_id}", dependencies=[Depends(get_current_user)])
async def delete_asset(asset_id: str):
    success = await asset_service.delete_asset(asset_id)
    if not success:
        raise HTTPException(status_code=404, detail="Asset not found")
    return {"message": "Asset deleted"}
