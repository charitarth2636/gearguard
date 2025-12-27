from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

try:
    print("Hashing...")
    h = pwd_context.hash("password123")
    print(f"Hash: {h}")
    print("Verifying...")
    v = pwd_context.verify("password123", h)
    print(f"Verified: {v}")
except Exception as e:
    print(f"Error: {e}")
