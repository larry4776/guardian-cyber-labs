from pydantic import BaseModel
from typing import Optional


class ExerciseCreate(BaseModel):
    course_id: int
    type: str
    title_fr: str
    title_en: Optional[str] = None
    description_fr: Optional[str] = None
    description_en: Optional[str] = None
    file_url: Optional[str] = None
    correct_answer: Optional[str] = None
    terminal_script: Optional[str] = None
    scenario_data: Optional[str] = None
    order: int = 0


class ExerciseUpdate(ExerciseCreate):
    pass


class ExerciseOut(BaseModel):
    id: int
    course_id: int
    type: str
    title_fr: str
    title_en: Optional[str] = None
    description_fr: Optional[str] = None
    description_en: Optional[str] = None
    file_url: Optional[str] = None
    terminal_script: Optional[str] = None
    scenario_data: Optional[str] = None
    order: int

    class Config:
        from_attributes = True


class ExerciseSubmit(BaseModel):
    answer: str


class ExerciseResult(BaseModel):
    is_correct: bool
    message_fr: str
    message_en: str