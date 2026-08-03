from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.course import Course, Lesson
from app.models.enrollment import Enrollment, LessonProgress
from app.schemas.course import CourseOut, CourseCreate, CourseUpdate, LessonCreate, LessonOut
from app.core.security import get_current_admin, get_current_user
from app.models.user import User

router = APIRouter(prefix="/courses", tags=["courses"])


@router.get("/", response_model=List[CourseOut])
def list_published_courses(domain: Optional[str] = None, level: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Course).filter(Course.status == "published")
    if domain:
        query = query.filter(Course.domain == domain)
    if level:
        query = query.filter(Course.level == level)
    return query.all()


@router.get("/all", response_model=List[CourseOut], dependencies=[Depends(get_current_admin)])
def list_all_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()


@router.get("/{course_id}", response_model=CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Cours introuvable.")
    return course


@router.post("/", response_model=CourseOut, status_code=201, dependencies=[Depends(get_current_admin)])
def create_course(payload: CourseCreate, db: Session = Depends(get_db)):
    course = Course(**payload.dict())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.put("/{course_id}", response_model=CourseOut, dependencies=[Depends(get_current_admin)])
def update_course(course_id: int, payload: CourseUpdate, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Cours introuvable.")
    for key, value in payload.dict().items():
        setattr(course, key, value)
    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}", dependencies=[Depends(get_current_admin)])
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Cours introuvable.")
    db.delete(course)
    db.commit()
    return {"status": "deleted"}


@router.post("/{course_id}/lessons", response_model=LessonOut, status_code=201, dependencies=[Depends(get_current_admin)])
def add_lesson(course_id: int, payload: LessonCreate, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Cours introuvable.")
    lesson = Lesson(course_id=course_id, **payload.dict())
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson


@router.delete("/{course_id}/lessons/{lesson_id}", dependencies=[Depends(get_current_admin)])
def delete_lesson(course_id: int, lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.course_id == course_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Leçon introuvable.")
    db.delete(lesson)
    db.commit()
    return {"status": "deleted"}


def _check_enrollment(course_id: int, current_user: User, db: Session):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Cours introuvable.")
    if course.is_free:
        return course
    enrollment = db.query(Enrollment).filter(
        Enrollment.course_id == course_id, Enrollment.user_id == current_user.id
    ).first()
    if not enrollment:
        raise HTTPException(status_code=403, detail="Accès non autorisé — ce cours n'a pas été acheté.")
    return course


@router.get("/{course_id}/lessons/{lesson_id}/video")
def get_lesson_video(course_id: int, lesson_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    _check_enrollment(course_id, current_user, db)
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.course_id == course_id).first()
    if not lesson or not lesson.video_url:
        raise HTTPException(status_code=404, detail="Vidéo introuvable.")
    return {"video_url": lesson.video_url}


@router.get("/{course_id}/resume-pdf")
def get_resume_pdf(course_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    course = _check_enrollment(course_id, current_user, db)
    if not course.resume_pdf_url:
        raise HTTPException(status_code=404, detail="Fiche synthèse indisponible.")
    return {"url": course.resume_pdf_url}


@router.get("/{course_id}/tp-pdf")
def get_tp_pdf(course_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    course = _check_enrollment(course_id, current_user, db)
    if not course.tp_pdf_url:
        raise HTTPException(status_code=404, detail="Travaux pratiques indisponibles.")
    return {"url": course.tp_pdf_url}


@router.post("/{course_id}/progress/{lesson_id}")
def mark_progress(course_id: int, lesson_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    _check_enrollment(course_id, current_user, db)
    progress = db.query(LessonProgress).filter(
        LessonProgress.lesson_id == lesson_id, LessonProgress.user_id == current_user.id
    ).first()
    if not progress:
        progress = LessonProgress(user_id=current_user.id, lesson_id=lesson_id, completed=True)
        db.add(progress)
    else:
        progress.completed = True
    db.commit()
    return {"status": "ok"}