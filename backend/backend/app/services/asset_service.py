from app.database.collections import assets_collection, categories_collection
from app.models.asset_model import AssetModel
from app.schemas.asset_schema import AssetCreate, AssetUpdate
from bson import ObjectId
from typing import List, Optional
from datetime import datetime

async def get_all_assets() -> List[AssetModel]:
    assets = await assets_collection().find().to_list(1000)
    return [AssetModel(**a) for a in assets]

async def get_asset_by_id(asset_id: str) -> Optional[AssetModel]:
    if not ObjectId.is_valid(asset_id):
        return None
    asset = await assets_collection().find_one({"_id": ObjectId(asset_id)})
    if asset:
        return AssetModel(**asset)
    return None

async def create_asset(asset_in: AssetCreate, created_by: str) -> Optional[AssetModel]:
    # Validate Category
    if not ObjectId.is_valid(asset_in.categoryId):
        return None # Or raise ValueError
    cat = await categories_collection().find_one({"_id": ObjectId(asset_in.categoryId)})
    if not cat:
        return None # Category not found

    asset_dict = asset_in.model_dump()
    asset_dict["createdBy"] = created_by
    asset_dict["createdAt"] = datetime.utcnow()
    
    db_asset = AssetModel(**asset_dict)
    
    res = await assets_collection().insert_one(db_asset.model_dump(by_alias=True, exclude={"id"}))
    created = await assets_collection().find_one({"_id": res.inserted_id})
    return AssetModel(**created)

async def update_asset(asset_id: str, asset_in: AssetUpdate) -> Optional[AssetModel]:
    if not ObjectId.is_valid(asset_id):
        return None
        
    update_data = asset_in.model_dump(exclude_unset=True)
    if not update_data:
        return await get_asset_by_id(asset_id)
        
    # If category changed, validate it
    if "categoryId" in update_data:
        if not ObjectId.is_valid(update_data["categoryId"]):
            return None
        cat = await categories_collection().find_one({"_id": ObjectId(update_data["categoryId"])})
        if not cat:
            return None # Invalid category

    res = await assets_collection().update_one(
        {"_id": ObjectId(asset_id)}, {"$set": update_data}
    )
    if res.matched_count == 0:
        return None
    return await get_asset_by_id(asset_id)

async def delete_asset(asset_id: str) -> bool:
    if not ObjectId.is_valid(asset_id):
        return False
    res = await assets_collection().delete_one({"_id": ObjectId(asset_id)})
    return res.deleted_count > 0
