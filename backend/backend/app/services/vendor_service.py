from app.database.collections import vendors_collection
from app.models.vendor_model import VendorModel
from app.schemas.vendor_schema import VendorCreate, VendorUpdate
from bson import ObjectId
from typing import List, Optional

async def get_all_vendors() -> List[VendorModel]:
    vendors = await vendors_collection().find().to_list(1000)
    return [VendorModel(**v) for v in vendors]

async def get_vendor_by_id(vendor_id: str) -> Optional[VendorModel]:
    if not ObjectId.is_valid(vendor_id):
        return None
    vendor = await vendors_collection().find_one({"_id": ObjectId(vendor_id)})
    if vendor:
        return VendorModel(**vendor)
    return None

async def create_vendor(vendor_in: VendorCreate) -> VendorModel:
    vendor_dict = vendor_in.model_dump()
    db_vendor = VendorModel(**vendor_dict)
    res = await vendors_collection().insert_one(db_vendor.model_dump(by_alias=True, exclude={"id"}))
    created = await vendors_collection().find_one({"_id": res.inserted_id})
    return VendorModel(**created)

async def update_vendor(vendor_id: str, vendor_in: VendorUpdate) -> Optional[VendorModel]:
    if not ObjectId.is_valid(vendor_id):
        return None
    update_data = vendor_in.model_dump(exclude_unset=True)
    if not update_data:
        return await get_vendor_by_id(vendor_id)
        
    res = await vendors_collection().update_one(
        {"_id": ObjectId(vendor_id)}, {"$set": update_data}
    )
    if res.matched_count == 0:
        return None
    return await get_vendor_by_id(vendor_id)

async def delete_vendor(vendor_id: str) -> bool:
    if not ObjectId.is_valid(vendor_id):
        return False
    res = await vendors_collection().delete_one({"_id": ObjectId(vendor_id)})
    return res.deleted_count > 0
