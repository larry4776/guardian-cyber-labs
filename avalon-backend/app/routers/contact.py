from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.contact import ContactMessage
from app.schemas.contact import ContactCreate, ContactOut
from app.core.security import get_current_admin

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("/", response_model=ContactOut, status_code=201)
def send_message(payload: ContactCreate, db: Session = Depends(get_db)):
    msg = ContactMessage(**payload.model_dump())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


@router.get("/", response_model=List[ContactOut], dependencies=[Depends(get_current_admin)])
def list_messages(db: Session = Depends(get_db)):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()


@router.put("/{message_id}/resolve", response_model=ContactOut, dependencies=[Depends(get_current_admin)])
def resolve_message(message_id: int, db: Session = Depends(get_db)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message introuvable.")
    msg.resolved = True
    db.commit()
    db.refresh(msg)
    return msg