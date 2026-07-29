# pyrefly: ignore [missing-import]
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
import os
# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine

# Models
from app.models.user import User
from app.models.interview import Interview
from app.models.resume import Resume
from app.models.interview_report import InterviewReport
from app.models.interview_question import InterviewQuestion
from app.models.interview_answer import InterviewAnswer

# Routers
from app.routes.auth import router as auth_router
from app.routes.interview import router as interview_router
from app.routes.resume import router as resume_router
from app.routes.interview_question import router as interview_question_router
from app.routes.interview_answer import router as interview_answer_router
from app.routes.interview_report import router as interview_report_router
from app.routes.dashboard import router as dashboard_router
# pyrefly: ignore [missing-import]
from fastapi import Request
# pyrefly: ignore [missing-import]
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from fastapi import Depends
from app.core.database import get_db
from app.models.user import User
from app.core.security import create_access_token
from app.utils.password import hash_password

load_dotenv()

oauth = OAuth()

oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile"
    }
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Interview Analyzer API"
)
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY")
)

# ==========================
# CORS
# ==========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://prep-me-livid.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# Routers
# ==========================
app.include_router(auth_router)
app.include_router(interview_router)
app.include_router(resume_router)
app.include_router(interview_question_router)
app.include_router(interview_answer_router)
app.include_router(interview_report_router)
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {
        "message": "AI Interview Analyzer API is running."
    }

@app.get("/auth/google")
async def google_login(request: Request):
    redirect_uri = "https://prep-me-backend.onrender.com/auth/google/callback"
    return await oauth.google.authorize_redirect(
        request,
        redirect_uri
    )
@app.get("/auth/google/callback")
async def google_callback(
    request: Request,
    db: Session = Depends(get_db)
):
    token = await oauth.google.authorize_access_token(request)

    user_info = token.get("userinfo")

    email = user_info["email"]
    name = user_info["name"]

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        user = User(
            full_name=name,
            email=email,
            hashed_password=hash_password("google_login"),
            is_verified=True,
            is_active=True
        )

        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(
        data={
            "sub": user.email
        }
    )

    return {
        "message": "Google login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.full_name,
            "email": user.email
        }
    }