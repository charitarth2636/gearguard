from app.database.collections import notifications_collection
from app.models.notification_model import NotificationModel
from app.schemas.notification_schema import NotificationCreate
from bson import ObjectId
from typing import List, Optional
from datetime import datetime

async def get_user_notifications(user_id: str) -> List[NotificationModel]:
    if not ObjectId.is_valid(user_id):
        return []
    notifs = await notifications_collection().find({"userId": ObjectId(user_id)}).sort("createdAt", -1).to_list(100)
    return [NotificationModel(**n) for n in notifs]

async def create_notification(notif_in: NotificationCreate) -> Optional[NotificationModel]:
    db_notif = NotificationModel(**notif_in.model_dump())
    res = await notifications_collection().insert_one(db_notif.model_dump(by_alias=True, exclude={"id"}))
    created = await notifications_collection().find_one({"_id": res.inserted_id})
    return NotificationModel(**created)

async def mark_as_read(notif_id: str) -> bool:
    if not ObjectId.is_valid(notif_id):
        return False
    res = await notifications_collection().update_one(
        {"_id": ObjectId(notif_id)}, {"$set": {"isRead": True}}
    )
    return res.modified_count > 0
