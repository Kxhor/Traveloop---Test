"""
session.py — Database Session Management

Provides a scoped session factory and a FastAPI dependency (get_db) that
yields a session per request and ensures cleanup afterwards.
"""

from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

from app.database.database import engine

# Session factory bound to our engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a database session.

    Usage in routes:
        @router.get("/example")
        def example(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
