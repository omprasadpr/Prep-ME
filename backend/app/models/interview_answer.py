from datetime import datetime, UTC

from sqlalchemy import Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id: Mapped[int] = mapped_column(primary_key=True)

    question_id: Mapped[int] = mapped_column(
        ForeignKey("interview_questions.id")
    )

    user_answer: Mapped[str] = mapped_column(
        Text
    )

    ai_feedback: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(UTC)
    )

    question = relationship(
        "InterviewQuestion",
        back_populates="answers"
    )