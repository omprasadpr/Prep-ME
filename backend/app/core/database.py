# pyrefly: ignore [missing-import]
from sqlalchemy import create_engine, text
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.exc import OperationalError

from app.core.config import settings


class Base(DeclarativeBase):
    pass


def create_db_engine_and_session(url: str):
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)

    connect_args = {}
    if url.startswith("sqlite"):
        connect_args = {"check_same_thread": False}

    eng = create_engine(url, connect_args=connect_args, pool_pre_ping=True)
    sm = sessionmaker(bind=eng, autoflush=False, autocommit=False)
    return eng, sm


primary_url = settings.DATABASE_URL or "sqlite:///./ai_interview_db.db"
fallback_url = "sqlite:///./ai_interview_db.db"

engine, SessionLocal = create_db_engine_and_session(primary_url)
fallback_engine, FallbackSession = create_db_engine_and_session(fallback_url)


def ensure_tables_created(target_engine):
    try:
        Base.metadata.create_all(bind=target_engine)
    except Exception as e:
        print(f"Warning: Table creation failed on target engine: {e}")


def get_db():
    try:
        ensure_tables_created(engine)
        db = SessionLocal()
        # Verify connection with quick ping
        db.execute(text("SELECT 1"))
        try:
            yield db
        finally:
            db.close()
    except Exception as e:
        print(f"[DB WARNING] Primary DB failed ({e}). Falling back to SQLite.")
        ensure_tables_created(fallback_engine)
        fallback_db = FallbackSession()
        try:
            yield fallback_db
        finally:
            fallback_db.close()
