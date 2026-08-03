from pydantic import BaseModel, EmailStr
from datetime import datetime


class ContactCreate(BaseModel):
    email: EmailStr
    subject: str
    message: str


class ContactOut(BaseModel):
    id: int
    email: str
    subject: str
    message: str
    resolved: bool
    created_at: datetime

    class Config:
        from_attributes = True