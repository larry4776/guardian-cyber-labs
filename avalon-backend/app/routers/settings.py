from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.settings import Setting
from app.core.security import get_current_admin
from pydantic import BaseModel

router = APIRouter(prefix="/settings", tags=["settings"])


class SettingUpdate(BaseModel):
    value: str


@router.get("/")
def get_all_settings(db: Session = Depends(get_db)):
    settings = db.query(Setting).all()
    return {s.key: s.value for s in settings}


@router.get("/{key}")
def get_setting(key: str, db: Session = Depends(get_db)):
    setting = db.query(Setting).filter(Setting.key == key).first()
    if not setting:
        defaults = {
            "currency": "FCFA",
            "stats_learners": "500+",
            "stats_certified": "120+",
            "stats_courses": "9",
            "stats_rating": "4.8/5",
        }
        return {"key": key, "value": defaults.get(key, "")}
    return {"key": setting.key, "value": setting.value}


@router.put("/{key}", dependencies=[Depends(get_current_admin)])
def update_setting(key: str, payload: SettingUpdate, db: Session = Depends(get_db)):
    setting = db.query(Setting).filter(Setting.key == key).first()
    if setting:
        setting.value = payload.value
    else:
        setting = Setting(key=key, value=payload.value)
        db.add(setting)
    db.commit()
    db.refresh(setting)
    return {"key": setting.key, "value": setting.value}