from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.interview_answer import InterviewAnswer
from app.models.interview_question import InterviewQuestion
from app.models.interview_report import InterviewReport
from app.models.resume import Resume

from app.services.ai_service import generate_interview_report
from app.services.interview_service import get_interview_by_id


def generate_report(
    interview_id: int,
    current_user,
    db: Session,
):
    interview = get_interview_by_id(
        interview_id,
        current_user,
        db,
    )

    existing_report = (
        db.query(InterviewReport)
        .filter(
            InterviewReport.interview_id == interview.id
        )
        .first()
    )

    if existing_report:
        return existing_report

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

    if not answers:
        raise HTTPException(
            status_code=400,
            detail="No answers submitted."
        )

    transcript_parts = []

    for answer in answers:

        transcript_parts.append(
            f"""
Question {answer.question.question_number}

Question:
{answer.question.question}

Ideal Answer:
{answer.question.ideal_answer}

Candidate Answer:
{answer.user_answer}

Evaluation Score:
{answer.score}/10

Feedback:
{answer.ai_feedback}

----------------------------------------------------
"""
        )

    transcript = "\n".join(transcript_parts)

    ai_report = generate_interview_report(
        role=interview.role,
        experience=interview.experience,
        difficulty=interview.difficulty,
        resume_text=resume.extracted_text,
        questions_and_answers=transcript,
    )

    report = InterviewReport(

        interview_id=interview.id,

        overall_score=ai_report.get(
            "overall_score",
            0,
        ),

        communication_score=ai_report.get(
            "communication_score",
            0,
        ),

        technical_score=ai_report.get(
            "technical_score",
            0,
        ),

        confidence_score=ai_report.get(
            "confidence_score",
            0,
        ),

        strengths=ai_report.get(
            "strengths",
            "",
        ),

        weaknesses=ai_report.get(
            "weaknesses",
            "",
        ),

        overall_feedback=ai_report.get(
            "overall_feedback",
            "",
        ),

        recommendation=ai_report.get(
            "recommendation",
            "Needs Improvement",
        ),

    )

    interview.status = "Completed"


    db.add(interview)
    db.add(report)
    db.commit()
    db.refresh(report)

    return report


def get_report(
    interview_id: int,
    current_user,
    db: Session,
):
    interview = get_interview_by_id(
        interview_id,
        current_user,
        db,
    )

    report = (
        db.query(InterviewReport)
        .filter(
            InterviewReport.interview_id == interview.id
        )
        .first()
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found."
        )

    return report