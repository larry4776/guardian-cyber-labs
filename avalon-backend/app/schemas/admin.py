from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserAdminOut(BaseModel):
    id: int
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class TransactionOut(BaseModel):
    id: int
    user_email: str
    course_title: str
    payment_method: Optional[str] = None
    status: str
    created_at: datetime