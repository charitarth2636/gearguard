from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.vendor_schema import VendorResponse, VendorCreate, VendorUpdate
from app.services import vendor_service
from app.middlewares.auth_middleware import get_current_user

router = APIRouter(prefix="/vendors", tags=["Vendors"])

@router.get("/", response_model=List[VendorResponse], dependencies=[Depends(get_current_user)])
async def read_vendors():
    return await vendor_service.get_all_vendors()

@router.get("/{vendor_id}", response_model=VendorResponse, dependencies=[Depends(get_current_user)])
async def read_vendor(vendor_id: str):
    vendor = await vendor_service.get_vendor_by_id(vendor_id)
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor

@router.post("/", response_model=VendorResponse, dependencies=[Depends(get_current_user)])
async def create_vendor(vendor_in: VendorCreate):
    return await vendor_service.create_vendor(vendor_in)

@router.put("/{vendor_id}", response_model=VendorResponse, dependencies=[Depends(get_current_user)])
async def update_vendor(vendor_id: str, vendor_in: VendorUpdate):
    vendor = await vendor_service.update_vendor(vendor_id, vendor_in)
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor

@router.delete("/{vendor_id}", dependencies=[Depends(get_current_user)])
async def delete_vendor(vendor_id: str):
    success = await vendor_service.delete_vendor(vendor_id)
    if not success:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return {"message": "Vendor deleted"}
