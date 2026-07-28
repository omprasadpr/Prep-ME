from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.interview_answer import InterviewAnswer
from app.models.interview_question import InterviewQuestion

from app.services.ai_service import evaluate_answer
from app.services.interview_service import get_interview_by_id


def submit_answer(
    data,
    current_user,
    db: Session,
):

    # Find Question
    question = (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.id == data.question_id
        )
        .first()
    )

    if question is None:
        raise HTTPException(
            status_code=404,
            detail="Question not found."
        )

    # Check duplicate submission
    existing_answer = (
        db.query(InterviewAnswer)
        .filter(
            InterviewAnswer.question_id == question.id
        )
        .first()
    )

    if existing_answer:
        raise HTTPException(
            status_code=400,
            detail="Answer already submitted."
        )

    # AI Evaluation
    ai_result = evaluate_answer(
        question.question,
        question.ideal_answer,
        data.user_answer,
    )

    # Save Answer
    answer = InterviewAnswer(
        question_id=question.id,
        user_answer=data.user_answer,
        ai_feedback=ai_result["feedback"],
        score=ai_result["score"],
    )

    db.add(answer)
    db.commit()
    db.refresh(answer)

    return answer


def get_interview_answers(
    interview_id: int,
    current_user,
    db: Session,
):

    interview = get_interview_by_id(
        interview_id,
        current_user,
        db,
    )

    answers = (
        db.query(InterviewAnswer)
        .join(InterviewQuestion)
        .filter(
            InterviewQuestion.interview_id == interview.id
        )
        .order_by(
            InterviewQuestion.question_number
        )
        .all()
    )

    return answers