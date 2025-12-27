from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.auth_schema import LoginRequest, Token
from app.schemas.user_schema import UserCreate, UserResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate):
    return await auth_service.register_user(user_in)

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest):
    return await auth_service.login_for_token(login_data.email, login_data.password)
