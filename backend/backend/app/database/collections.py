from app.database.mongo import db

def get_collection(collection_name: str):
    return db.get_db()[collection_name]

# Defined collections for easy access
def users_collection():
    return get_collection("users")

def assets_collection():
    return get_collection("assets")

def categories_collection():
    return get_collection("categories")

def vendors_collection():
    return get_collection("vendors")

def maintenance_schedules_collection():
    return get_collection("maintenance_schedules")

def maintenance_logs_collection():
    return get_collection("maintenance_logs")

def notifications_collection():
    return get_collection("notifications")

def audit_logs_collection():
    return get_collection("audit_logs")
