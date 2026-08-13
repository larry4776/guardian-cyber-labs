from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional

from app.database import get_db
from app.models.submissions import Submission
from app.models.enrollment import Enrollment
from app.models.course import Course
from app.models.user import User
from app.schemas.submissions import SubmissionCreate, SubmissionGrade, SubmissionOut, SubmissionAdminOut
from app.core.security import get_current_admin, get_current_user
from app.core.email import email_livrable_corrige

router = APIRouter(prefix="/submissions", tags=["submissions"])


def _to_out(s: Submission) -> dict:
    return {
        "id": s.id, "course_id": s.course_id, "user_id": s.user_id,
        "content_text": s.content_text, "file_url": s.file_url,
        "status": s.status, "grade": s.grade,
        "feedback_fr": s.feedback_fr, "feedback_en": s.feedback_en,
        "submitted_at": s.submitted_at.isoformat() if s.submitted_at else "",
        "graded_at": s.graded_at.isoformat() if s.graded_at else None,
    }


@router.post("/", response_model=SubmissionOut, status_code=201)
def create_submission(payload: SubmissionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == payload.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Parcours introuvable.")

    if not course.is_free:
        enrollment = db.query(Enrollment).filter(
            Enrollment.course_id == payload.course_id, Enrollment.user_id == current_user.id
        ).first()
        if not enrollment:
            raise HTTPException(status_code=403, detail="Accès non autorisé — ce parcours n'a pas été acheté.")

    existing = db.query(Submission).filter(
        Submission.course_id == payload.course_id, Submission.user_id == current_user.id
    ).first()

    if existing:
        existing.content_text = payload.content_text
        existing.file_url = payload.file_url
        existing.status = "pending"
        existing.grade = None
        existing.feedback_fr = None
        existing.feedback_en = None
        existing.graded_at = None
        db.commit()
        db.refresh(existing)
        return _to_out(existing)

    submission = Submission(
        course_id=payload.course_id, user_id=current_user.id,
        content_text=payload.content_text, file_url=payload.file_url, status="pending",
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return _to_out(submission)


@router.get("/me/{course_id}", response_model=Optional[SubmissionOut])
def get_my_submission(course_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    submission = db.query(Submission).filter(
        Submission.course_id == course_id, Submission.user_id == current_user.id
    ).first()
    if not submission:
        return None
    return _to_out(submission)


@router.get("/admin/all", response_model=List[SubmissionAdminOut], dependencies=[Depends(get_current_admin)])
def list_all_submissions(db: Session = Depends(get_db)):
    rows = (
        db.query(Submission, User.email, Course.title_fr)
        .join(User, Submission.user_id == User.id)
        .join(Course, Submission.course_id == Course.id)
        .order_by(Submission.submitted_at.desc())
        .all()
    )
    results = []
    for s, email, title in rows:
        out = _to_out(s)
        out["user_email"] = email
        out["course_title"] = title
        results.append(out)
    return results


@router.put("/{submission_id}/grade", response_model=SubmissionOut, dependencies=[Depends(get_current_admin)])
def grade_submission(submission_id: int, payload: SubmissionGrade, db: Session = Depends(get_db)):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Soumission introuvable.")

    submission.status = payload.status
    submission.grade = payload.grade
    submission.feedback_fr = payload.feedback_fr
    submission.feedback_en = payload.feedback_en
    submission.graded_at = datetime.utcnow()
    db.commit()
    db.refresh(submission)

    student = db.query(User).filter(User.id == submission.user_id).first()
    course = db.query(Course).filter(Course.id == submission.course_id).first()
    if student and course:
        email_livrable_corrige(
            student.first_name or '',
            student.email,
            course.title_fr,
            payload.grade or 0,
            payload.feedback_fr or '',
            payload.status
        )

    if payload.status == "validated":
        from app.routers.certificates import issue_certificate_if_needed
        issue_certificate_if_needed(submission.user_id, submission.course_id, db)

    return _to_out(submission)