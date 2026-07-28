from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_user

from app.schemas.interview_schema import (
    InterviewCreate,
    InterviewResponse,
    InterviewProgressRequest,
)

from app.services.interview_service import (
    create_interview,
    get_my_interviews,
    get_interview_by_id,
    delete_interview,
    update_interview_progress,
    complete_interview,
)

router = APIRouter(
    prefix="/interviews",
    tags=["Interviews"],
)


@router.post("")
def create_interview_route(
    interview: InterviewCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    return create_interview(
        interview,
        current_user,
        db,
    )


@router.get("")
def get_my_interviews_route(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    return get_my_interviews(
        current_user,
        db,
    )


@router.get(
    "/{interview_id}",
    response_model=InterviewResponse,
)
def get_interview_route(
    interview_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    return get_interview_by_id(
        interview_id,
        current_user,
        db,
    )


@router.delete("/{interview_id}")
def delete_interview_route(
    interview_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    return delete_interview(
        interview_id,
        current_user,
        db,
    )


@router.put("/{interview_id}/progress")
def update_progress(

    interview_id: int,

    request: InterviewProgressRequest,

    current_user=Depends(get_current_user),

    db: Session = Depends(get_db),

):

    return update_interview_progress(

        interview_id,

        request.current_question,

        current_user,

        db,

    )


@router.put("/{interview_id}/complete")
def complete_interview_route(

    interview_id: int,

    current_user=Depends(get_current_user),

    db: Session = Depends(get_db),

):

    return complete_interview(

        interview_id,

        current_user,

        db,

    )