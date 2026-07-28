from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_user

from app.schemas.interview_question_schema import (
    InterviewQuestionResponse,
)

from app.services.interview_question_service import (
    generate_questions,
    get_questions,
)

router = APIRouter(
    prefix="/interview-questions",
    tags=["Interview Questions"],
)


@router.post(
    "/generate/{interview_id}",
    response_model=list[InterviewQuestionResponse],
)
def generate_questions_route(
    interview_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    return generate_questions(
        interview_id,
        current_user,
        db,
    )


@router.get(
    "/{interview_id}",
    response_model=list[InterviewQuestionResponse],
)
def get_questions_route(
    interview_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    return get_questions(
        interview_id,
        current_user,
        db,
    )