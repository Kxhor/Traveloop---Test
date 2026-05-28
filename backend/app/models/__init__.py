"""
models — SQLAlchemy ORM models

Each file defines one domain entity.  Import all models here so that
Base.metadata.create_all() discovers them automatically.
"""

from app.models.user import User          # noqa: F401
from app.models.trip import Trip          # noqa: F401
from app.models.stop import Stop          # noqa: F401
from app.models.activity import Activity  # noqa: F401
from app.models.expense import Expense    # noqa: F401
