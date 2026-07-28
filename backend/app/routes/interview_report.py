from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_user

from app.models.user import User

from app.schemas.interview_report_schema import (
    InterviewReportResponse,
)

from app.services.interview_report_service import (
    generate_report,
    get_report,
)

router = APIRouter(
    prefix="/interview-report",
    tags=["Interview Report"],
)


@router.post(
    "/generate/{interview_id}",
    response_model=InterviewReportResponse,
)
def create_report(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    return generate_report(
        interview_id,
        current_user,
        db,
    )


@router.get(
    "/{interview_id}",
    response_model=InterviewReportResponse,
)
def get_interview_report(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    return get_report(
        interview_id,
        current_user,
        db,
    )