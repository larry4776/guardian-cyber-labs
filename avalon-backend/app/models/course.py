from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)

    title_fr = Column(String, nullable=False)
    title_en = Column(String, nullable=True)
    description_fr = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)

    price = Column(Integer, default=0)
    is_free = Column(Boolean, default=False)

    domain = Column(String, nullable=True)
    level = Column(String, nullable=True)

    status = Column(String, default="draft")
    thumbnail_url = Column(String, nullable=True)
    instructor_name = Column(String, nullable=True)

    rating = Column(Integer, default=0)
    reviews_count = Column(Integer, default=0)
    students_count = Column(Integer, default=0)
    is_bestseller = Column(Boolean, default=False)

    resume_pdf_url = Column(String, nullable=True)
    tp_pdf_url = Column(String, nullable=True)

    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))

    title_fr = Column(String, nullable=False)
    title_en = Column(String, nullable=True)

    duration = Column(String, default="00:00")
    video_url = Column(String, nullable=True)
    order = Column(Integer, default=0)
    skill_tags = Column(String, nullable=True)

    course = relationship("Course", back_populates="lessons")