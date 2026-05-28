"""
main.py — FastAPI Application Entry Point

This is the root of the Traveloop backend.
It initializes the FastAPI app instance, registers all route modules,
and sets up CORS and startup/shutdown events.

Run with:
    uvicorn app.main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# pyrefly: ignore [missing-import]
from app.routes.auth_routes import router as auth_router
# pyrefly: ignore [missing-import]
from app.routes.trip_routes import router as trip_router
# pyrefly: ignore [missing-import]
from app.routes.stop_routes import router as stop_router
# pyrefly: ignore [missing-import]
from app.routes.activity_routes import router as activity_router
# pyrefly: ignore [missing-import]
from app.routes.expense_routes import router as expense_router
# pyrefly: ignore [missing-import]
from app.config.settings import settings
# pyrefly: ignore [missing-import]
from app.database.database import engine, Base

# Create database tables (ideal for demo/dev, usually handled by Alembic in prod)

Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="Traveloop API",
    description="A multi-city travel itinerary management platform",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS — allow frontend origins (configure in .env for production)
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Register routers
# ---------------------------------------------------------------------------
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(trip_router, prefix="/api/trips", tags=["Trips"])
app.include_router(stop_router, prefix="/api/stops", tags=["Stops"])
app.include_router(activity_router, prefix="/api/activities", tags=["Activities"])
app.include_router(expense_router, prefix="/api/expenses", tags=["Expenses"])


@app.get("/", tags=["Health"])
async def health_check():
    """Basic health-check endpoint."""
    return {"status": "ok", "app": "Traveloop", "version": "1.0.0"}
