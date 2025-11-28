from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from app.models.user import User
from app.models.admin import Admin
from app.models.product import Product
from app.models.order import Order
from app.routers import auth, products, orders, users, analytics, uploads

app = FastAPI(title="Craftopia API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Database Init
@app.on_event("startup")
async def on_startup():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    await init_beanie(
        database=client[settings.DB_NAME],
        document_models=[User, Admin, Product, Order]
    )

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(analytics.router, prefix="/api/admin/analytics", tags=["Analytics"])
app.include_router(uploads.router, prefix="/api/uploads", tags=["Uploads"])

@app.get("/")
async def root():
    return {"message": "Welcome to Craftopia API"}
