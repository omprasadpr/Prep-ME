from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_user

from app.schemas.interview_answer_schema import (
    AnswerRequest,
)

from app.services.interview_answer_service import (
    submit_answer,
    get_interview_answers,
)

router = APIRouter(
    prefix="/interview-answers",
    tags=["Interview Answers"],
)


@router.post("")
def submit_answer_route(
    answer: AnswerRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return submit_answer(
        answer,
        current_user,
        db,
    )


@router.get("/{interview_id}")
def get_answers_route(
    interview_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_interview_answers(
        interview_id,
        current_user,
        db,
    )