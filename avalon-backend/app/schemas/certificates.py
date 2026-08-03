from pydantic import BaseModel
from typing import Optional


class CertificateOut(BaseModel):
    id: int
    course_id: int
    course_title: str
    code: str
    is_public: bool
    issued_at: str


class PublicCertificateOut(BaseModel):
    code: str
    student_name: str
    course_title: str
    domain: Optional[str] = None
    level: Optional[str] = None
    issued_at: str


class CertificateVisibility(BaseModel):
    is_public: bool