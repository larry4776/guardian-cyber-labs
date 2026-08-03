from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.exercises import Exercise, ExerciseAttempt
from app.models.enrollment import Enrollment
from app.models.user import User
from app.schemas.exercises import ExerciseCreate, ExerciseUpdate, ExerciseOut, ExerciseSubmit, ExerciseResult
from app.core.security import get_current_admin, get_current_user

router = APIRouter(prefix="/exercises", tags=["exercises"])


def _check_access(course_id: int, current_user: User, db: Session):
    from app.models.course import Course
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Parcours introuvable.")
    if course.is_free:
        return
    enrollment = db.query(Enrollment).filter(
        Enrollment.course_id == course_id, Enrollment.user_id == current_user.id
    ).first()
    if not enrollment:
        raise HTTPException(status_code=403, detail="Accès non autorisé — ce parcours n'a pas été acheté.")


@router.get("/course/{course_id}", response_model=List[ExerciseOut])
def list_exercises_for_course(course_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    _check_access(course_id, current_user, db)
    return db.query(Exercise).filter(Exercise.course_id == course_id).order_by(Exercise.order).all()


@router.get("/admin/course/{course_id}", response_model=List[ExerciseOut], dependencies=[Depends(get_current_admin)])
def list_exercises_admin(course_id: int, db: Session = Depends(get_db)):
    return db.query(Exercise).filter(Exercise.course_id == course_id).order_by(Exercise.order).all()


@router.post("/", response_model=ExerciseOut, status_code=201, dependencies=[Depends(get_current_admin)])
def create_exercise(payload: ExerciseCreate, db: Session = Depends(get_db)):
    exercise = Exercise(**payload.dict())
    db.add(exercise)
    db.commit()
    db.refresh(exercise)
    return exercise


@router.put("/{exercise_id}", response_model=ExerciseOut, dependencies=[Depends(get_current_admin)])
def update_exercise(exercise_id: int, payload: ExerciseUpdate, db: Session = Depends(get_db)):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercice introuvable.")
    for key, value in payload.dict().items():
        setattr(exercise, key, value)
    db.commit()
    db.refresh(exercise)
    return exercise


@router.delete("/{exercise_id}", dependencies=[Depends(get_current_admin)])
def delete_exercise(exercise_id: int, db: Session = Depends(get_db)):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercice introuvable.")
    db.delete(exercise)
    db.commit()
    return {"status": "deleted"}


@router.post("/{exercise_id}/submit", response_model=ExerciseResult)
def submit_answer(exercise_id: int, payload: ExerciseSubmit, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercice introuvable.")
    _check_access(exercise.course_id, current_user, db)

    is_correct = False
    if exercise.correct_answer:
        is_correct = payload.answer.strip().lower() == exercise.correct_answer.strip().lower()

    attempt = ExerciseAttempt(
        exercise_id=exercise_id,
        user_id=current_user.id,
        answer_given=payload.answer,
        is_correct=is_correct,
    )
    db.add(attempt)
    db.commit()

    if is_correct:
        return ExerciseResult(is_correct=True, message_fr="Bonne réponse !", message_en="Correct answer!")
    return ExerciseResult(is_correct=False, message_fr="Réponse incorrecte, réessaie.", message_en="Incorrect answer, try again.")