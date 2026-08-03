from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base

class Enrollment(Base):
    """Prouve qu'un étudiant a payé (ou a un cours gratuit) — vérifié côté serveur avant de donner accès aux vidéos/PDF."""
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    payment_method = Column(String, nullable=True)  # "mtn", "wave", "card", "paypal", ou null si gratuit
    status = Column(String, default="paid")  # "paid"
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class LessonProgress(Base):
    """Stocké séparément du cours — une ligne par (étudiant, leçon) complétée."""
    __tablename__ = "lesson_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    completed = Column(Boolean, default=True)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())