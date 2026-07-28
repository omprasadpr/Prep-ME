from pydantic import BaseModel


class ResumeAnalysisResponse(BaseModel):
    ats_score: int
    resume_summary: str

    technical_skills: list[str]
    soft_skills: list[str]

    projects_analysis: str
    achievements: str

    missing_skills: list[str]

    grammar_writing: str
    formatting: str

    role_fit: str

    interview_readiness: str

    suggestions: list[str]