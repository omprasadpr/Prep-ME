from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth_schema import (
    RegisterRequest,
    LoginRequest,
    ResendVerificationRequest,
)

from app.utils.password import (
    hash_password,
    verify_password,
)

from app.core.security import (
    create_access_token,
    create_verification_token,
    verify_verification_token,
)
from app.services.email_service import EmailService


def register_user(
    user_data: RegisterRequest,
    db: Session,
):
    normalized_email = user_data.email.strip().lower()
    full_name = user_data.full_name.strip()

    existing_user = (
        db.query(User)
        .filter(User.email == normalized_email)
        .first()
    )

    if existing_user:
        if existing_user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered. Please log in."
            )
        else:
            # Unverified account re-registering: update credentials & resend link
            existing_user.full_name = full_name
            existing_user.hashed_password = hash_password(user_data.password)
            db.commit()
            db.refresh(existing_user)

            token = create_verification_token(existing_user.email)
            try:
                EmailService.send_verification_email(existing_user.email, existing_user.full_name, token)
            except Exception as e:
                print(f"[AUTH WARNING] Email dispatch error: {e}")

            return existing_user

    new_user = User(
        full_name=full_name,
        email=normalized_email,
        hashed_password=hash_password(user_data.password),
        is_verified=False,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_verification_token(new_user.email)
    try:
        EmailService.send_verification_email(new_user.email, new_user.full_name, token)
    except Exception as e:
        print(f"[AUTH WARNING] Email dispatch error: {e}")

    return new_user


def verify_email(
    token: str,
    db: Session,
):
    """Verify email verification JWT token and mark user as verified."""
    email = verify_verification_token(token)

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found."
        )

    if user.is_verified:
        return {"message": "Email is already verified. You can now log in."}

    user.is_verified = True
    db.commit()

    return {"message": "Email verified successfully. You can now log in."}


def resend_verification(
    data: ResendVerificationRequest,
    db: Session,
):
    """Resend email verification link without revealing whether account exists."""
    normalized_email = data.email.strip().lower()

    user = (
        db.query(User)
        .filter(User.email == normalized_email)
        .first()
    )

    if user and not user.is_verified:
        token = create_verification_token(user.email)
        try:
            EmailService.send_verification_email(user.email, user.full_name, token)
        except Exception as e:
            print(f"[AUTH WARNING] Email dispatch error: {e}")

    # Always return standard message to prevent account enumeration attacks
    return {"message": "If an account exists with this email, a verification link has been sent."}


def login_user(
    user_data: LoginRequest,
    db: Session,
):
    normalized_email = user_data.email.strip().lower()

    user = (
        db.query(User)
        .filter(User.email == normalized_email)
        .first()
    )

    if user is None or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in.",
        )

    access_token = create_access_token(
        data={"sub": user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }