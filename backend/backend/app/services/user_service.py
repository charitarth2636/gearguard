from app.database.collections import users_collection
from app.models.user_model import UserModel
from app.schemas.user_schema import UserUpdate, UserCreate
from app.utils.password import get_password_hash
from bson import ObjectId
from typing import List, Optional

async def get_all_users() -> List[UserModel]:
    users = await users_collection().find().to_list(1000)
    return [UserModel(**user) for user in users]

async def get_user_by_id(user_id: str) -> Optional[UserModel]:
    if not ObjectId.is_valid(user_id):
        return None
    user = await users_collection().find_one({"_id": ObjectId(user_id)})
    if user:
        return UserModel(**user)
    return None

async def create_user(user_in: UserCreate) -> UserModel:
    # Check email
    if await users_collection().find_one({"email": user_in.email}):
        return None 
    
    user_dict = user_in.model_dump()
    user_dict["password"] = get_password_hash(user_dict["password"])
    db_user = UserModel(**user_dict)
    
    res = await users_collection().insert_one(db_user.model_dump(by_alias=True, exclude={"id"}))
    created_user = await users_collection().find_one({"_id": res.inserted_id})
    return UserModel(**created_user)

async def update_user(user_id: str, user_in: UserUpdate) -> Optional[UserModel]:
    if not ObjectId.is_valid(user_id):
        return None
    
    update_data = user_in.model_dump(exclude_unset=True)
    if "password" in update_data and update_data["password"]:
        update_data["password"] = get_password_hash(update_data["password"])
        
    if not update_data:
        return await get_user_by_id(user_id)

    res = await users_collection().update_one(
        {"_id": ObjectId(user_id)}, {"$set": update_data}
    )
    if res.modified_count == 0 and res.matched_count == 0:
        return None
        
    return await get_user_by_id(user_id)

async def delete_user(user_id: str) -> bool:
    if not ObjectId.is_valid(user_id):
        return False
    res = await users_collection().delete_one({"_id": ObjectId(user_id)})
    return res.deleted_count > 0
