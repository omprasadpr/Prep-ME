from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.interview import Interview
from app.models.interview_question import InterviewQuestion
from app.models.resume import Resume

from app.services.ai_service import generate_interview_questions


def generate_questions(
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

    existing_questions = (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.interview_id == interview.id
        )
        .count()
    )

    if existing_questions > 0:
        raise HTTPException(
            status_code=400,
            detail="Questions already generated."
        )

    # Fetch user's resume
    resume = (
        db.query(Resume)
        .filter(
            Resume.user_id == current_user.id
        )
        .first()
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    ai_response = generate_interview_questions(
        resume_text=resume.extracted_text,
        role=interview.role,
        experience=interview.experience,
        difficulty=interview.difficulty,
    )

    questions = []

    for item in ai_response["questions"]:

        question = InterviewQuestion(
            interview_id=interview.id,
            question_number=item["question_number"],
            question=item["question"],
        )

        db.add(question)
        questions.append(question)

    # ❌ DO NOT CHANGE STATUS HERE
    # Interview should remain Pending until
    # the user submits the first answer.

    db.commit()

    for question in questions:
        db.refresh(question)

    return questions


def get_questions(
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

    questions = (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.interview_id == interview_id
        )
        .order_by(
            InterviewQuestion.question_number
        )
        .all()
    )

    return questions