from pydantic import BaseModel
from typing import Optional


class PaymentCreate(BaseModel):
    course_id: int
    method: str  # "mtn", "wave", "card", "paypal"


class EnrollmentOut(BaseModel):
    id: int
    course_id: int
    payment_method: Optional[str] = None
    status: str

    class Config:
        from_attributes = True