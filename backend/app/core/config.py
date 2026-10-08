# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    DATABASE_URL: str = "sqlite:///./ai_interview_db.db"

    SECRET_KEY: str = "7f2b8d3e9c1a4f6d8b0e2c5a7f9d1b3e6a8c0d2f4e6b8a1c"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    GROQ_API_KEY: str = ""

    # Resend Email Verification Settings
    RESEND_API_KEY: str = ""
    FRONTEND_URL: str = "https://prep-me-livid.vercel.app"

    # Google OAuth 2.0 Settings
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()