from datetime import datetime, UTC

from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Interview(Base):
    __tablename__ = "interviews"

    id: Mapped[int] = mapped_column(primary_key=True)

    title: Mapped[str] = mapped_column(
        String(255)
    )

    role: Mapped[str] = mapped_column(
        String(100)
    )

    experience: Mapped[str] = mapped_column(
        String(50)
    )

    difficulty: Mapped[str] = mapped_column(
        String(50)
    )

    # ✅ NEW
    total_questions: Mapped[int] = mapped_column(
        default=10
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="Pending"
    )
    current_question: Mapped[int] = mapped_column(
        default=1
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(UTC)
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )

    user = relationship(
        "User",
        back_populates="interviews"
    )

    questions = relationship(
        "InterviewQuestion",
        back_populates="interview",
        cascade="all, delete-orphan"
    )

    report = relationship(
        "InterviewReport",
        back_populates="interview",
        uselist=False,
        cascade="all, delete-orphan"
    )