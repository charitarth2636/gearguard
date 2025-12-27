from app.database.collections import categories_collection
from app.models.category_model import CategoryModel
from app.schemas.category_schema import CategoryCreate, CategoryUpdate
from bson import ObjectId
from typing import List, Optional

async def get_all_categories() -> List[CategoryModel]:
    categories = await categories_collection().find().to_list(1000)
    return [CategoryModel(**c) for c in categories]

async def get_category_by_id(cat_id: str) -> Optional[CategoryModel]:
    if not ObjectId.is_valid(cat_id):
        return None
    cat = await categories_collection().find_one({"_id": ObjectId(cat_id)})
    if cat:
        return CategoryModel(**cat)
    return None

async def create_category(cat_in: CategoryCreate) -> CategoryModel:
    cat_dict = cat_in.model_dump()
    db_cat = CategoryModel(**cat_dict)
    res = await categories_collection().insert_one(db_cat.model_dump(by_alias=True, exclude={"id"}))
    created = await categories_collection().find_one({"_id": res.inserted_id})
    return CategoryModel(**created)

async def update_category(cat_id: str, cat_in: CategoryUpdate) -> Optional[CategoryModel]:
    if not ObjectId.is_valid(cat_id):
        return None
    update_data = cat_in.model_dump(exclude_unset=True)
    if not update_data:
        return await get_category_by_id(cat_id)
        
    res = await categories_collection().update_one(
        {"_id": ObjectId(cat_id)}, {"$set": update_data}
    )
    if res.matched_count == 0:
        return None
    return await get_category_by_id(cat_id)

async def delete_category(cat_id: str) -> bool:
    if not ObjectId.is_valid(cat_id):
        return False
    res = await categories_collection().delete_one({"_id": ObjectId(cat_id)})
    return res.deleted_count > 0
