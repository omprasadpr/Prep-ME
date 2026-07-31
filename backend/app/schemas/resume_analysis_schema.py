from typing import Optional, Union, Dict, List
from pydantic import BaseModel


class ResumeAnalysisResponse(BaseModel):
    ats_score: Optional[int] = 0
    keyword_match: Optional[int] = 0
    format_score: Optional[int] = 0
    resume_summary: Optional[str] = ""

    technical_skills: Optional[Union[Dict[str, List[str]], List[str]]] = {}
    soft_skills: Optional[List[str]] = []

    projects_analysis: Optional[str] = ""
    achievements: Optional[str] = ""

    missing_skills: Optional[Union[Dict[str, List[str]], List[str]]] = {}

    grammar_writing: Optional[str] = ""
    formatting: Optional[str] = ""

    role_fit: Optional[Union[List[str], str]] = []

    interview_readiness: Optional[Union[int, str]] = 0
    confidence_score: Optional[int] = 0

    suggestions: Optional[List[str]] = []