from datetime import datetime

from pydantic import BaseModel


class InterviewQuestionResponse(BaseModel):

    id: int
    interview_id: int
    question_number: int
    question: str
    created_at: datetime

    class Config:
        from_attributes = True