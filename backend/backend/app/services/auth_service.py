from app.database.collections import users_collection
from app.schemas.user_schema import UserCreate
from app.models.user_model import UserModel
from app.utils.password import get_password_hash, verify_password
from app.utils.jwt import create_access_token
from fastapi import HTTPException, status
from typing import Optional

async def register_user(user_in: UserCreate) -> UserModel:
    existing_user = await users_collection().find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_dict = user_in.model_dump()
    user_dict["password"] = get_password_hash(user_dict["password"])
    
    # Create model instance to handle defaults
    db_user = UserModel(**user_dict)
    
    new_user = await users_collection().insert_one(db_user.model_dump(by_alias=True, exclude={"id"}))
    created_user = await users_collection().find_one({"_id": new_user.inserted_id})
    return UserModel(**created_user)

async def authenticate_user(email: str, password: str) -> Optional[dict]:
    user_data = await users_collection().find_one({"email": email})
    if not user_data:
        return None
    if not verify_password(password, user_data['password']):
        return None
    return user_data

async def login_for_token(email: str, password: str) -> dict:
    user = await authenticate_user(email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user['email']})
    return {"access_token": access_token, "token_type": "bearer"}
