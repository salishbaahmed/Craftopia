"""
Craftopia Backend - Main Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_db
from app.routers import auth, products, orders, users, analytics, uploads


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup"""
    print("Initializing database...")
    await init_db()
    print("Database initialized!")
    yield
    print("Shutting down...")


# Create FastAPI app
app = FastAPI(
    title="Craftopia API",
    description="E-commerce platform for handcrafted items",
    version="2.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers - NO PREFIX HERE (routers already have their own prefixes)
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(users.router)
app.include_router(analytics.router)
app.include_router(uploads.router)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Welcome to Craftopia API",
        "version": "2.0.0",
        "status": "healthy"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",
        "version": "2.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )