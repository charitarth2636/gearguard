from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.mongo import db
from app.routes import (
    auth_routes,
    user_routes,
    asset_routes,
    category_routes,
    vendor_routes,
    maintenance_routes,
    dashboard_routes,
    notification_routes,
    report_routes
)
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    db.connect()
    yield
    # Shutdown
    db.disconnect()

app = FastAPI(title="Maintenance App API", lifespan=lifespan)

# CORS validation
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173", # Vite default
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(asset_routes.router)
app.include_router(category_routes.router)
app.include_router(vendor_routes.router)
app.include_router(maintenance_routes.router)
app.include_router(dashboard_routes.router)
app.include_router(notification_routes.router)
app.include_router(report_routes.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Maintenance App API"}
