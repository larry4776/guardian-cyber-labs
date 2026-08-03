import secrets
import random
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.course import Course, Lesson
from app.models.enrollment import Enrollment, LessonProgress
from app.schemas.user import (
    UserRegister, UserOut, Token, ForgotPasswordRequest,
    ResetPasswordRequest, UserUpdate, ConfirmPasswordChangeRequest, EnrollmentOut
)
from app.core.security import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Un compte existe déjà avec cet email.")

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        first_name=payload.first_name,
        last_name=payload.last_name,
        country=payload.country,
        phone=payload.phone,
        role="student",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": token, "user": user}


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect.")

    token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": token, "user": user}


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserOut)
def update_me(payload: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.first_name is not None:
        current_user.first_name = payload.first_name
    if payload.last_name is not None:
        current_user.last_name = payload.last_name
    if payload.country is not None:
        current_user.country = payload.country
    if payload.phone is not None:
        current_user.phone = payload.phone
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/me/enrollments", response_model=list[EnrollmentOut])
def get_my_enrollments(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    enrollments = db.query(Enrollment).filter(Enrollment.user_id == current_user.id).all()
    results = []
    for e in enrollments:
        course = db.query(Course).filter(Course.id == e.course_id).first()
        if not course:
            continue
        total_lessons = db.query(Lesson).filter(Lesson.course_id == course.id).count()
        completed = (
            db.query(LessonProgress)
            .join(Lesson, LessonProgress.lesson_id == Lesson.id)
            .filter(Lesson.course_id == course.id, LessonProgress.user_id == current_user.id, LessonProgress.completed == True)
            .count()
        )
        results.append(EnrollmentOut(
            course_id=course.id,
            course_title=course.title_fr,
            thumbnail_url=course.thumbnail_url,
            payment_method=e.payment_method,
            purchased_at=e.created_at.isoformat() if e.created_at else "",
            completed_lessons=completed,
            total_lessons=total_lessons,
        ))
    return results


@router.post("/request-password-change-code")
def request_password_change_code(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    code = f"{random.randint(0, 999999):06d}"
    current_user.reset_token = code
    current_user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=10)
    db.commit()
    print(f"[CODE DE VÉRIFICATION] {current_user.email} → {code}")
    return {"message": "Un code a été envoyé à ton adresse email."}


@router.post("/confirm-password-change")
def confirm_password_change(payload: ConfirmPasswordChangeRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.reset_token or current_user.reset_token != payload.code:
        raise HTTPException(status_code=400, detail="Code incorrect.")
    if not current_user.reset_token_expiry or current_user.reset_token_expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Code expiré, redemande-en un.")

    current_user.hashed_password = hash_password(payload.new_password)
    current_user.reset_token = None
    current_user.reset_token_expiry = None
    db.commit()
    return {"message": "Mot de passe modifié avec succès."}


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        return {"message": "Si ce compte existe, un lien de réinitialisation a été généré."}

    token = secrets.token_urlsafe(32)
    user.reset_token = token
    user.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
    db.commit()

    return {
        "message": "Lien de réinitialisation généré.",
        "reset_link": f"http://localhost:3000/reset-password?token={token}"
    }


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == payload.token).first()
    if not user or not user.reset_token_expiry or user.reset_token_expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Lien invalide ou expiré.")

    user.hashed_password = hash_password(payload.new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.commit()
    return {"message": "Mot de passe réinitialisé avec succès."}