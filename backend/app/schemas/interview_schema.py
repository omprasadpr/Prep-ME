from datetime import datetime

from pydantic import BaseModel


class InterviewCreate(BaseModel):
    role: str
    experience: str
    difficulty: str
    total_questions: int


class InterviewResponse(BaseModel):
    id: int
    title: str
    role: str
    experience: str
    difficulty: str
    status: str
    created_at: datetime
    current_question: int


    class Config:
        from_attributes = True
        
class InterviewProgressRequest(BaseModel):

    current_question: int