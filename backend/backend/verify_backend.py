import requests
import json
import sys
import random
import string

BASE_URL = "http://127.0.0.1:8000"

def log(msg, status="INFO"):
    print(f"[{status}] {msg}")

def fail(msg):
    log(msg, "FAIL")
    sys.exit(1)

def success(msg):
    log(msg, "SUCCESS")

# Generate random string for email
def random_str(length=8):
    return ''.join(random.choices(string.ascii_lowercase, k=length))

session = requests.Session()
token = None
headers = {"Content-Type": "application/json"}

# 1. AUTH
log("--- 1. AUTH MODULE ---")
email = f"test_{random_str()}@mail.com"
password = "password123"

# Register
payload = {
  "name": "Charitarth",
  "email": email,
  "password": password,
  "role": "admin"
}
log(f"Registering user: {email}")
r = session.post(f"{BASE_URL}/auth/register", json=payload, headers=headers)
if r.status_code not in [200, 201]:
    fail(f"Registration failed: {r.text}")
success("User registered")

# Login
log("Logging in...")
payload = {"email": email, "password": password}
r = session.post(f"{BASE_URL}/auth/login", json=payload, headers=headers)
if r.status_code != 200:
    fail(f"Login failed: {r.text}")
token = r.json().get("access_token")
if not token:
    fail("No token received")
headers["Authorization"] = f"Bearer {token}"
success("Login successful, Token received")

# 2. CATEGORIES
log("--- 2. CATEGORIES MODULE ---")
payload = {
  "name": "Electrical",
  "type": "asset"
}
log("Creating Category...")
r = session.post(f"{BASE_URL}/categories/", json=payload, headers=headers)
if r.status_code != 200:
    fail(f"Create Category failed: {r.text}")
cat_id = r.json().get("_id") or r.json().get("id")
success(f"Category created: {cat_id}")

# 3. VENDORS (Create first so we have ID)
log("--- 3. VENDORS MODULE ---")
payload = {
  "name": "ABC Services",
  "phone": "9999999999",
  "email": "abc@mail.com"
}
log("Creating Vendor...")
r = session.post(f"{BASE_URL}/vendors/", json=payload, headers=headers)
if r.status_code != 200:
    fail(f"Create Vendor failed: {r.text}")
vendor_id = r.json().get("_id") or r.json().get("id")
success(f"Vendor created: {vendor_id}")

# 4. ASSETS
log("--- 4. ASSETS MODULE ---")
payload = {
  "name": "Generator",
  "categoryId": cat_id,
  "modelNumber": "GEN-X2",
  "serialNumber": "SN123",
  "purchaseDate": "2023-01-01T00:00:00Z",
  "warrantyExpiry": "2025-01-01T00:00:00Z",
  "cost": 45000,
  "location": "Plant A",
  "status": "active",
  "notes": "Initial setup"
}
log("Creating Asset...")
r = session.post(f"{BASE_URL}/assets/", json=payload, headers=headers)
if r.status_code != 200:
    fail(f"Create Asset failed: {r.text}")
asset_id = r.json().get("_id") or r.json().get("id")
success(f"Asset created: {asset_id}")

# 5. MAINTENANCE
log("--- 5. MAINTENANCE MODULE ---")
# Schedule
payload = {
  "assetId": asset_id,
  "maintenanceType": "Oil Change",
  "frequency": "monthly",
  "nextDate": "2023-12-01T00:00:00Z",
  "reminderDays": 3,
  "vendorId": vendor_id,
  "estimatedCost": 1200,
  "status": "upcoming"
}
log("Creating Schedule...")
r = session.post(f"{BASE_URL}/maintenance/schedules", json=payload, headers=headers)
if r.status_code != 200:
    fail(f"Create Schedule failed: {r.text}")
schedule_id = r.json().get("_id") or r.json().get("id")
success(f"Schedule created: {schedule_id}")

# Log
payload = {
  "assetId": asset_id,
  "scheduleId": schedule_id,
  "performedDate": "2023-12-01T00:00:00Z",
  "description": "Oil replaced",
  "cost": 1300,
  "vendorId": vendor_id
}
log("Creating Maintenance Log...")
r = session.post(f"{BASE_URL}/maintenance/logs", json=payload, headers=headers)
if r.status_code != 200:
    fail(f"Create Log failed: {r.text}")
success("Maintenance Log created")

# 6. DASHBOARD
log("--- 6. DASHBOARD MODULE ---")
log("Fetching stats...")
r = session.get(f"{BASE_URL}/dashboard/stats", headers=headers)
if r.status_code != 200:
    fail(f"Get Stats failed: {r.text}")
stats = r.json()
success(f"Stats received: {stats}")

# 7. SECURITY CHECK
log("--- 7. SECURITY TESTS ---")
log("Testing unauthorized access...")
r = requests.get(f"{BASE_URL}/assets/")
if r.status_code == 401:
    success("Unauthorized access blocked (401)")
else:
    fail(f"Security check failed! Status: {r.status_code}")

log("--- ALL TESTS PASSED ---")
