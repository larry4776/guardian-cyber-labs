from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    content_text = Column(Text, nullable=True)
    file_url = Column(String, nullable=True)

    status = Column(String, default="pending")  # "pending" | "validated" | "needs_review"
    grade = Column(Integer, nullable=True)  # note sur 100
    feedback_fr = Column(Text, nullable=True)
    feedback_en = Column(Text, nullable=True)

    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    graded_at = Column(DateTime(timezone=True), nullable=True)