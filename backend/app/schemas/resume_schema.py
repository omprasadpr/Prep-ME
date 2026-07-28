from datetime import datetime
from pydantic import BaseModel
from app.schemas.resume_analysis_schema import ResumeAnalysisResponse



class ResumeResponse(BaseModel):
    id: int
    filename: str
    uploaded_at: datetime

    class Config:
        from_attributes = True

class ResumeUploadResponse(BaseModel):
    resume: ResumeResponse
    analysis: ResumeAnalysisResponse