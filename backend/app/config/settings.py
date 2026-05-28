"""
settings.py — Centralised Configuration

Loads environment variables from a .env file and exposes them as typed
attributes via Pydantic's BaseSettings.  All secrets and tunables live here.
"""

from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application-wide settings loaded from environment variables."""

    # ── App ──────────────────────────────────────────────────────────────
    APP_NAME: str = "Traveloop"
    DEBUG: bool = True

    # ── Database (SQLite for Demo) ───────────────────────────────────────
    DATABASE_URL: str = "sqlite:///./traveloop.db"

    # ── JWT ──────────────────────────────────────────────────────────────
    JWT_SECRET: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60

    # ── Redis (optional cache layer) ─────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── CORS ─────────────────────────────────────────────────────────────
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Singleton instance — import this everywhere
settings = Settings()
