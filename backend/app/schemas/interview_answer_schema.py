from datetime import datetime

from pydantic import BaseModel


class AnswerRequest(BaseModel):
    question_id: int
    user_answer: str


class AnswerResponse(BaseModel):
    id: int
    question_id: int
    user_answer: str
    ai_feedback: str | None = None
    score: float | None = None
    created_at: datetime

    class Config:
        from_attributes = True