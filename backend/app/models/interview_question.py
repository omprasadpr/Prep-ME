from datetime import datetime, UTC

from sqlalchemy import Text, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id: Mapped[int] = mapped_column(primary_key=True)

    interview_id: Mapped[int] = mapped_column(
        ForeignKey("interviews.id")
    )

    question_number: Mapped[int]

    question: Mapped[str] = mapped_column(
        Text
    )

    ideal_answer: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(UTC)
    )

    interview = relationship(
        "Interview",
        back_populates="questions"
    )

    answers = relationship(
        "InterviewAnswer",
        back_populates="question",
        cascade="all, delete-orphan"
    )