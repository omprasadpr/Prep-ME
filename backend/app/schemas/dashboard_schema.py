from datetime import datetime

from pydantic import BaseModel


class QuickStats(BaseModel):

    total_interviews: int

    completed_interviews: int

    pending_interviews: int

    in_progress_interviews: int

    average_score: float

    best_score: float

    best_role: str


class NotificationStats(BaseModel):

    pending: int

    in_progress: int

    average_score: float

    best_score: float


class RecentInterview(BaseModel):

    id: int

    title: str

    role: str

    experience: str

    status: str

    difficulty: str

    created_at: datetime

    score: float | None

    report_available: bool

    class Config:
        from_attributes = True


class DashboardResponse(BaseModel):

    user_name: str

    resume_uploaded: bool

    quick_stats: QuickStats

    notifications: NotificationStats

    recent_interviews: list[RecentInterview]