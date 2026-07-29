import os
from dotenv import load_dotenv

from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth
from sqlalchemy.orm import Session

from app.core.database import Base, engine, get_db
from app.core.config import settings
from app.core.security import create_access_token
from app.utils.password import hash_password

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

load_dotenv()

oauth = OAuth()

google_client_id = settings.GOOGLE_CLIENT_ID or os.getenv("GOOGLE_CLIENT_ID", "")
google_client_secret = settings.GOOGLE_CLIENT_SECRET or os.getenv("GOOGLE_CLIENT_SECRET", "")

if google_client_id and google_client_secret:
    oauth.register(
        name="google",
        client_id=google_client_id,
        client_secret=google_client_secret,
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
    secret_key=settings.SECRET_KEY or os.getenv("SECRET_KEY", "secret_session_key_123")
)

# ==========================
# CORS
# ==========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "https://prep-me-livid.vercel.app",
        "*",
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
    """Initiate server-side Google OAuth 2.0 redirect flow."""
    # Determine appropriate redirect_uri dynamically based on request host / environment
    host = request.headers.get("host", "")
    if "onrender.com" in host or "prep-me-backend.onrender.com" in host:
        redirect_uri = "https://prep-me-backend.onrender.com/auth/google/callback"
    else:
        redirect_uri = str(request.url_for("google_callback"))

    return await oauth.google.authorize_redirect(
        request,
        redirect_uri
    )


@app.get("/auth/google/callback")
async def google_callback(
    request: Request,
    db: Session = Depends(get_db)
):
    """Handle server-side Google OAuth 2.0 callback and redirect to frontend with access_token."""
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")

    if not user_info or "email" not in user_info:
        frontend_url = settings.FRONTEND_URL or "http://localhost:5173"
        return RedirectResponse(url=f"{frontend_url}/login?error=google_auth_failed")

    email = user_info["email"].strip().lower()
    name = user_info.get("name", "Google User").strip()

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        user = User(
            full_name=name,
            email=email,
            hashed_password=hash_password("google_login_authlib"),
            is_verified=True,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not user.is_verified:
        user.is_verified = True
        db.commit()
        db.refresh(user)

    access_token = create_access_token(
        data={
            "sub": user.email
        }
    )

    frontend_url = settings.FRONTEND_URL.rstrip('/') if settings.FRONTEND_URL else "http://localhost:5173"
    return RedirectResponse(url=f"{frontend_url}/login?token={access_token}")