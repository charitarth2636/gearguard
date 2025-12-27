from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.user_schema import UserResponse, UserUpdate, UserCreate
from app.services import user_service
from app.middlewares.auth_middleware import get_current_user
from app.middlewares.role_middleware import RoleChecker

router = APIRouter(prefix="/users", tags=["Users"])

# Admin only for listing? Or all authenticated? Let's say Admin.
admin_only = RoleChecker(["admin"])

@router.get("/", response_model=List[UserResponse], dependencies=[Depends(admin_only)])
async def read_users():
    return await user_service.get_all_users()

@router.get("/{user_id}", response_model=UserResponse)
async def read_user(user_id: str, current_user = Depends(get_current_user)):
    # User can see themselves, Admin can see anyone
    if str(current_user.id) != user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    user = await user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=UserResponse, dependencies=[Depends(admin_only)])
async def create_user(user_in: UserCreate):
    user = await user_service.create_user(user_in)
    if not user:
        raise HTTPException(status_code=400, detail="User could not be created (email might exist)")
    return user

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user_in: UserUpdate, current_user = Depends(get_current_user)):
    if str(current_user.id) != user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    user = await user_service.update_user(user_id, user_in)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{user_id}", dependencies=[Depends(admin_only)])
async def delete_user(user_id: str):
    success = await user_service.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}
