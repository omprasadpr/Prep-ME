from sqlalchemy.orm import Session

from app.models.user import User
from app.models.resume import Resume
from app.models.interview import Interview
from app.models.interview_report import InterviewReport


def get_dashboard_data(db: Session, current_user: User):

    # Resume
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    resume_uploaded = resume is not None

    # Total Interviews
    total_interviews = (
        db.query(Interview)
        .filter(
            Interview.user_id == current_user.id
        )
        .count()
    )

    # Completed Interviews
    completed_interviews = (
        db.query(Interview)
        .filter(
            Interview.user_id == current_user.id,
            Interview.status == "Completed",
        )
        .count()
    )

    # Pending Interviews
    pending_interviews = (
        db.query(Interview)
        .filter(
            Interview.user_id == current_user.id,
            Interview.status == "Pending",
        )
        .count()
    )

    # In Progress Interviews
    in_progress_interviews = (
        db.query(Interview)
        .filter(
            Interview.user_id == current_user.id,
            Interview.status == "In Progress",
        )
        .count()
    )

    # Reports
    reports = (
        db.query(InterviewReport)
        .join(
            Interview,
            Interview.id == InterviewReport.interview_id
        )
        .filter(
            Interview.user_id == current_user.id
        )
        .all()
    )

    if reports:

        scores = [report.overall_score for report in reports]

        average_score = round(sum(scores) / len(scores), 1)

        best_report = max(
            reports,
            key=lambda report: report.overall_score
        )

        best_score = best_report.overall_score

        best_role = best_report.interview.role

    else:

        average_score = 0

        best_score = 0

        best_role = "-"

    # Recent Interviews
    recent = (
        db.query(Interview)
        .filter(
            Interview.user_id == current_user.id
        )
        .order_by(
            Interview.created_at.desc()
        )
        .limit(5)
        .all()
    )

    recent_interviews = []

    for interview in recent:

        report = (
            db.query(InterviewReport)
            .filter(
                InterviewReport.interview_id == interview.id
            )
            .first()
        )

        recent_interviews.append({

            "id": interview.id,

            "title": interview.title,

            "role": interview.role,

            "experience": interview.experience,

            "status": interview.status,

            "difficulty": interview.difficulty,

            "created_at": interview.created_at,

            "score": (
                report.overall_score
                if report
                else None
            ),

            "report_available": report is not None,

        })

    return {

        "user_name": current_user.full_name,

        "resume_uploaded": resume_uploaded,

        "quick_stats": {

            "total_interviews": total_interviews,

            "completed_interviews": completed_interviews,

            "pending_interviews": pending_interviews,

            "in_progress_interviews": in_progress_interviews,

            "average_score": average_score,

            "best_score": best_score,

            "best_role": best_role,

        },

        "notifications": {

            "pending": pending_interviews,

            "in_progress": in_progress_interviews,

            "average_score": average_score,

            "best_score": best_score,

        },

        "recent_interviews": recent_interviews,

    }