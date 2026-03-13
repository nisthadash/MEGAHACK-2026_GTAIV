from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool, StaticPool
from config import settings

# Create database engine
# For SQLite, use StaticPool and check_same_thread=False
if settings.DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        settings.DATABASE_URL,
        echo=settings.SQLALCHEMY_ECHO,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
else:
    # For PostgreSQL and other databases
    engine = create_engine(
        settings.DATABASE_URL,
        echo=settings.SQLALCHEMY_ECHO,
        poolclass=NullPool,
    )

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
