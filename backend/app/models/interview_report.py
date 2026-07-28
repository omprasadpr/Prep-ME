from sqlalchemy import ForeignKey, Float, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class InterviewReport(Base):
    __tablename__ = "interview_reports"

    id: Mapped[int] = mapped_column(primary_key=True)

    interview_id: Mapped[int] = mapped_column(
        ForeignKey("interviews.id"),
        unique=True,
    )

    overall_score: Mapped[float] = mapped_column(Float)

    communication_score: Mapped[float] = mapped_column(Float)

    technical_score: Mapped[float] = mapped_column(Float)

    confidence_score: Mapped[float] = mapped_column(Float)

    strengths: Mapped[str] = mapped_column(Text)

    weaknesses: Mapped[str] = mapped_column(Text)

    overall_feedback: Mapped[str] = mapped_column(Text)

    recommendation: Mapped[str] = mapped_column(Text)

    interview = relationship(
        "Interview",
        back_populates="report",
    )