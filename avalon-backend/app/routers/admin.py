from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from typing import Optional

from app.database import get_db
from app.models.user import User
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.schemas.admin import UserAdminOut, TransactionOut
from app.core.security import get_current_admin, hash_password

router = APIRouter(prefix="/admin", tags=["admin"])


class RoleUpdate(BaseModel):
    role: str


class AdminCreate(BaseModel):
    email: str
    password: str
    first_name: Optional[str] = None


@router.get("/users", response_model=List[UserAdminOut], dependencies=[Depends(get_current_admin)])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.get("/transactions", response_model=List[TransactionOut], dependencies=[Depends(get_current_admin)])
def list_transactions(db: Session = Depends(get_db)):
    rows = (
        db.query(Enrollment, User.email, Course.title_fr)
        .join(User, Enrollment.user_id == User.id)
        .join(Course, Enrollment.course_id == Course.id)
        .order_by(Enrollment.created_at.desc())
        .all()
    )
    return [
        TransactionOut(
            id=e.id,
            user_email=email,
            course_title=title,
            payment_method=e.payment_method,
            status=e.status,
            created_at=e.created_at,
        )
        for e, email, title in rows
    ]


@router.put("/users/{user_id}/role", response_model=UserAdminOut, dependencies=[Depends(get_current_admin)])
def update_user_role(user_id: int, payload: RoleUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")
    user.role = payload.role
    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}", dependencies=[Depends(get_current_admin)])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")
    db.delete(user)
    db.commit()
    return {"status": "deleted"}


@router.post("/users", response_model=UserAdminOut, status_code=201, dependencies=[Depends(get_current_admin)])
def create_admin(payload: AdminCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Un compte existe déjà avec cet email.")
    new_admin = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        first_name=payload.first_name,
        role="admin",
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin