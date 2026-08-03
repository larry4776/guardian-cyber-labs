from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.enrollment import Enrollment
from app.models.course import Course
from app.models.user import User
from app.core.security import get_current_user, get_current_admin

router = APIRouter(prefix="/payments", tags=["payments"])


class PaymentSimulateRequest(BaseModel):
    course_id: int
    method: str


@router.post("/simulate")
def simulate_payment(payload: PaymentSimulateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == payload.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Parcours introuvable.")

    existing = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id, Enrollment.course_id == payload.course_id
    ).first()
    if existing:
        return {"status": "already_enrolled"}

    enrollment = Enrollment(
        user_id=current_user.id,
        course_id=payload.course_id,
        payment_method=payload.method,
        status="paid",
    )
    db.add(enrollment)
    db.commit()
    return {"status": "success"}


@router.get("/admin/summary", dependencies=[Depends(get_current_admin)])
def payment_summary(db: Session = Depends(get_db)):
    rows = (
        db.query(Enrollment.payment_method, Course.price, Course.title_fr)
        .join(Course, Enrollment.course_id == Course.id)
        .all()
    )

    total_revenue = sum(price for _, price, _ in rows)

    breakdown = {}
    for method, _, _ in rows:
        key = method or "gratuit"
        breakdown[key] = breakdown.get(key, 0) + 1

    sales_per_course = {}
    for _, _, title in rows:
        sales_per_course[title] = sales_per_course.get(title, 0) + 1

    top_course = {"title": None, "sales": 0}
    if sales_per_course:
        top_title = max(sales_per_course, key=sales_per_course.get)
        top_course = {"title": top_title, "sales": sales_per_course[top_title]}

    return {
        "total_revenue": total_revenue,
        "payment_breakdown": breakdown,
        "top_course": top_course,
    }