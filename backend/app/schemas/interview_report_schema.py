from pydantic import BaseModel


class InterviewReportResponse(BaseModel):
    id: int
    interview_id: int

    overall_score: int
    communication_score: int
    technical_score: int
    confidence_score: int

    strengths: str
    weaknesses: str
    overall_feedback: str
    recommendation: str

    class Config:
        from_attributes = True