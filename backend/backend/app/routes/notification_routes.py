from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.notification_schema import NotificationResponse, NotificationCreate
from app.services import notification_service
from app.middlewares.auth_middleware import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/", response_model=List[NotificationResponse])
async def get_my_notifications(current_user = Depends(get_current_user)):
    return await notification_service.get_user_notifications(str(current_user.id))

@router.put("/{notif_id}/read")
async def mark_read(notif_id: str, current_user = Depends(get_current_user)):
    # Should verify user owns the notification
    success = await notification_service.mark_as_read(notif_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Marked as read"}

@router.post("/", response_model=NotificationResponse) # Internal or for testing
async def create_notif(notif_in: NotificationCreate):
    return await notification_service.create_notification(notif_in)
