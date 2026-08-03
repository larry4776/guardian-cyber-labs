from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))

    type = Column(String, nullable=False)  # "file_challenge" | "terminal" | "scenario"

    title_fr = Column(String, nullable=False)
    title_en = Column(String, nullable=True)
    description_fr = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)

    file_url = Column(String, nullable=True)
    correct_answer = Column(String, nullable=True)

    terminal_script = Column(Text, nullable=True)
    scenario_data = Column(Text, nullable=True)

    order = Column(Integer, default=0)

    attempts = relationship("ExerciseAttempt", back_populates="exercise", cascade="all, delete-orphan")


class ExerciseAttempt(Base):
    __tablename__ = "exercise_attempts"

    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    answer_given = Column(String, nullable=True)
    is_correct = Column(Boolean, default=False)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())

    exercise = relationship("Exercise", back_populates="attempts")