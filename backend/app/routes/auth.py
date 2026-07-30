# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, Query
# pyrefly: ignore [missing-import]
from fastapi.security import OAuth2PasswordRequestForm
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies import get_current_user

from app.models.user import User

from app.schemas.auth_schema import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    VerifyEmailTokenRequest,
    ResendVerificationRequest,
    MessageResponse,
    GoogleLoginRequest,
)

from app.schemas.user_schema import UserResponse

from app.services.auth_service import (
    register_user,
    login_user,
    verify_email,
    resend_verification,
    google_login_user,
    guest_login_user,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
)
def register(
    user: RegisterRequest,
    db: Session = Depends(get_db),
):
    return register_user(user, db)


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    user: LoginRequest,
    db: Session = Depends(get_db),
):
    return login_user(user, db)


@router.post(
    "/guest",
    response_model=TokenResponse,
)
def guest_login(
    db: Session = Depends(get_db),
):
    return guest_login_user(db)


@router.post(
    "/google",
    response_model=TokenResponse,
)
def google_login(
    data: GoogleLoginRequest,
    db: Session = Depends(get_db),
):
    return google_login_user(data, db)



@router.get(
    "/verify-email",
    response_model=MessageResponse,
)
def verify_email_get(
    token: str = Query(..., description="JWT verification token"),
    db: Session = Depends(get_db),
):
    return verify_email(token, db)


@router.post(
    "/verify-email",
    response_model=MessageResponse,
)
def verify_email_post(
    data: VerifyEmailTokenRequest,
    db: Session = Depends(get_db),
):
    return verify_email(data.token, db)


@router.post(
    "/resend-verification",
    response_model=MessageResponse,
)
def resend_verification_route(
    data: ResendVerificationRequest,
    db: Session = Depends(get_db),
):
    return resend_verification(data, db)


# Swagger OAuth2 endpoint
@router.post(
    "/token",
    response_model=TokenResponse,
)
def swagger_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = LoginRequest(
        email=form_data.username,
        password=form_data.password,
    )

    return login_user(user, db)


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user