"""
database.py — SQLAlchemy Engine & Declarative Base

Creates the SQLAlchemy engine from the DATABASE_URL setting and provides
a declarative Base class that all ORM models inherit from.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base

from app.config.settings import settings

# Create the SQLAlchemy engine
# connect_args={"check_same_thread": False} is required only for SQLite
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {},
    pool_pre_ping=True,
)

# Declarative base for all models
Base = declarative_base()
