from pydantic import BaseModel
from typing import Optional


class SubmissionCreate(BaseModel):
    course_id: int
    content_text: Optional[str] = None
    file_url: Optional[str] = None


class SubmissionGrade(BaseModel):
    status: str  # "validated" | "needs_review"
    grade: Optional[int] = None
    feedback_fr: Optional[str] = None
    feedback_en: Optional[str] = None


class SubmissionOut(BaseModel):
    id: int
    course_id: int
    user_id: int
    content_text: Optional[str] = None
    file_url: Optional[str] = None
    status: str
    grade: Optional[int] = None
    feedback_fr: Optional[str] = None
    feedback_en: Optional[str] = None
    submitted_at: str
    graded_at: Optional[str] = None

    class Config:
        from_attributes = True


class SubmissionAdminOut(SubmissionOut):
    user_email: str
    course_title: str