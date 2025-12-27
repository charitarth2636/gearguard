import asyncio
from app.database.mongo import db
from app.models.user_model import UserModel
from app.utils.password import get_password_hash
from app.database.collections import users_collection

async def seed_data():
    db.connect()
    
    email = "admin@example.com"
    password = "password123"
    
    # Check if user exists
    existing = await users_collection().find_one({"email": email})
    if existing:
        print(f"User {email} already exists.")
    else:
        print(f"Creating user {email}...")
        user_data = {
            "name": "Admin User",
            "email": email,
            "password": get_password_hash(password),
            "role": "admin",
            "isVerified": True
        }
        # Use model to populate defaults (like createdAt)
        user_model = UserModel(**user_data)
        await users_collection().insert_one(user_model.model_dump(by_alias=True, exclude={"id"}))
        print(f"User created successfully.")
        print(f"Email: {email}")
        print(f"Password: {password}")

    db.disconnect()

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(seed_data())
