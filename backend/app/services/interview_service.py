from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.interview import Interview
from app.models.resume import Resume


def create_interview(
    data,
    current_user,
    db: Session,
):

    # Check whether the user has uploaded a resume
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Please upload your resume first."
        )

    # Create Interview
    interview = Interview(
        title=f"{data.role} Interview",
        role=data.role,
        experience=data.experience,
        difficulty=data.difficulty,
        total_questions=data.total_questions,
        user_id=current_user.id,
    )

    db.add(interview)
    db.commit()
    db.refresh(interview)

    return interview


def get_my_interviews(
    current_user,
    db: Session,
):

    return (
        db.query(Interview)
        .filter(Interview.user_id == current_user.id)
        .all()
    )


def get_interview_by_id(
    interview_id: int,
    current_user,
    db: Session,
):

    interview = (
        db.query(Interview)
        .filter(
            Interview.id == interview_id,
            Interview.user_id == current_user.id,
        )
        .first()
    )

    if interview is None:
        raise HTTPException(
            status_code=404,
            detail="Interview not found",
        )

    return interview


def delete_interview(
    interview_id: int,
    current_user,
    db: Session,
):

    interview = (
        db.query(Interview)
        .filter(
            Interview.id == interview_id,
            Interview.user_id == current_user.id,
        )
        .first()
    )

    if interview is None:
        raise HTTPException(
            status_code=404,
            detail="Interview not found."
        )

    db.delete(interview)
    db.commit()

    return {
        "message": "Interview deleted successfully."
    }
def update_interview_progress(
    interview_id: int,
    current_question: int,
    current_user,
    db: Session,
):

    interview = (
        db.query(Interview)
        .filter(
            Interview.id == interview_id,
            Interview.user_id == current_user.id,
        )
        .first()
    )

    if interview is None:
        raise HTTPException(
            status_code=404,
            detail="Interview not found."
        )

    # Update current question
    interview.current_question = current_question

    # Mark as In Progress only after the first submitted answer
    if interview.status == "Pending":
        interview.status = "In Progress"

    db.commit()
    db.refresh(interview)

    return {
        "message": "Progress updated."
    }
def complete_interview(

    interview_id: int,

    current_user,

    db: Session,

):

    interview = (

        db.query(Interview)

        .filter(

            Interview.id == interview_id,

            Interview.user_id == current_user.id,

        )

        .first()

    )

    if interview is None:

        raise HTTPException(

            status_code=404,

            detail="Interview not found."

        )

    interview.status = "Completed"

    interview.current_question = interview.total_questions

    db.commit()

    db.refresh(interview)

    return interview