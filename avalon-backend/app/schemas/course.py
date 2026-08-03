from pydantic import BaseModel
from typing import Optional, List


class LessonCreate(BaseModel):
    title_fr: str
    title_en: Optional[str] = None
    duration: str
    video_url: Optional[str] = None
    order: int = 0
    skill_tags: Optional[str] = None


class LessonOut(BaseModel):
    id: int
    title_fr: str
    title_en: Optional[str] = None
    duration: str
    video_url: Optional[str] = None
    order: int
    skill_tags: Optional[str] = None

    class Config:
        from_attributes = True


class CourseCreate(BaseModel):
    title_fr: str
    title_en: Optional[str] = None
    description_fr: Optional[str] = None
    description_en: Optional[str] = None
    price: int = 0
    is_free: bool = False
    domain: Optional[str] = None
    level: Optional[str] = None
    status: str = "draft"
    thumbnail_url: Optional[str] = None
    instructor_name: Optional[str] = None
    rating: Optional[int] = 0
    reviews_count: Optional[int] = 0
    students_count: Optional[int] = 0
    is_bestseller: Optional[bool] = False
    resume_pdf_url: Optional[str] = None
    tp_pdf_url: Optional[str] = None


class CourseUpdate(CourseCreate):
    pass


class CourseOut(BaseModel):
    id: int
    title_fr: str
    title_en: Optional[str] = None
    description_fr: Optional[str] = None
    description_en: Optional[str] = None
    price: int
    is_free: bool
    domain: Optional[str] = None
    level: Optional[str] = None
    status: str
    thumbnail_url: Optional[str] = None
    instructor_name: Optional[str] = None
    rating: Optional[int] = 0
    reviews_count: Optional[int] = 0
    students_count: Optional[int] = 0
    is_bestseller: Optional[bool] = False
    resume_pdf_url: Optional[str] = None
    tp_pdf_url: Optional[str] = None
    lessons: List[LessonOut] = []

    class Config:
        from_attributes = True