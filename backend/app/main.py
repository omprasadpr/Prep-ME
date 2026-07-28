from fastapi import FastAPI
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

# Create database tables
Base.metadata.create_all(bind=engine)

print("===================================")
print("THIS IS MY BACKEND")
print("===================================")

app = FastAPI(
    title="AI Interview Analyzer API"
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