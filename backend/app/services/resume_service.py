import os
import shutil

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.models.user import User

from app.services.ai_service import generate_resume_analysis

from app.utils.pdf_parser import extract_text_from_pdf
from app.utils.resume_parser import parse_resume

UPLOAD_DIR = "uploads/resumes"

os.makedirs(UPLOAD_DIR, exist_ok=True)


def upload_resume(
    file: UploadFile,
    current_user: User,
    db: Session
):
    # Check file type
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    existing_resume = (
        db.query(Resume)
        .filter(
            Resume.user_id == current_user.id
        )
        .first()
    )

    # Delete old file
    if existing_resume:
        if os.path.exists(existing_resume.file_path):
            os.remove(existing_resume.file_path)

    filename = f"user_{current_user.id}_{file.filename}"

    file_path = os.path.join(
        UPLOAD_DIR,
        filename
    )

    # Save PDF
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text
    resume_text = extract_text_from_pdf(file_path)

    # Parse resume
    parsed_resume = parse_resume(resume_text)

    print(parsed_resume)

    print("\n========== RESUME TEXT ==========\n")
    print(resume_text)
    print("\n=================================\n")

    # AI Analysis
    resume_analysis = generate_resume_analysis(
        resume_text
    )

    print("\n========== AI ANALYSIS ==========\n")
    print(resume_analysis)
    print("\n=================================\n")

    # Update existing resume
    if existing_resume:

        existing_resume.filename = filename
        existing_resume.file_path = file_path
        existing_resume.extracted_text = resume_text

        db.commit()
        db.refresh(existing_resume)

        return {
            "resume": existing_resume,
            "analysis": resume_analysis
        }

    # Create new resume
    resume = Resume(
        filename=filename,
        file_path=file_path,
        extracted_text=resume_text,
        user_id=current_user.id,
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "resume": resume,
        "analysis": resume_analysis
    }


def get_resume(
    current_user: User,
    db: Session
):
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

    return resume


def delete_resume(
    current_user: User,
    db: Session,
):
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

    # Delete PDF file
    if os.path.exists(resume.file_path):
        os.remove(resume.file_path)

    # Delete database record
    db.delete(resume)
    db.commit()

    return {
        "message": "Resume deleted successfully."
    }