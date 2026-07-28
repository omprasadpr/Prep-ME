
from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_user

from app.services.resume_service import (
    upload_resume,
    get_resume,
    delete_resume,
)
from fastapi.responses import FileResponse

router = APIRouter(
    prefix="/resume",
    tags=["Resume"],
)


@router.post("/upload")
def upload_resume_route(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return upload_resume(
        file,
        current_user,
        db,
    )


@router.get("/")
def get_resume_route(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_resume(
        current_user,
        db,
    )

@router.get("/view")
def view_resume(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resume = get_resume(
        current_user,
        db,
    )

    return FileResponse(
        path=resume.file_path,
        media_type="application/pdf",
        filename=resume.filename,
    )

# @router.get("/view")
# def view_resume():
#     raise HTTPException(status_code=404, detail="Testing")
@router.delete("/")

def delete_resume_route(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return delete_resume(
        current_user,
        db,
    )