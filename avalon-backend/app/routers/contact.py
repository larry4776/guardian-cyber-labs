from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.database import get_db
from app.models.contact import ContactMessage
from app.models.user import User
from app.schemas.contact import ContactCreate, ContactOut
from app.core.security import get_current_admin
from app.core.email import send_email_sync

router = APIRouter(prefix="/contact", tags=["contact"])


class AdminReply(BaseModel):
    reply: str


class AdminMessage(BaseModel):
    user_ids: List[int]
    subject: str
    message: str


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


@router.post("/{message_id}/reply", dependencies=[Depends(get_current_admin)])
def reply_to_message(message_id: int, payload: AdminReply, db: Session = Depends(get_db)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message introuvable.")

    send_email_sync(
        to=msg.email,
        subject=f"Réponse à votre message — GUARDIAN CYBER LABS",
        body=f"""
        <div style="font-family:Inter,sans-serif;background:#05070D;color:#fff;padding:40px;max-width:600px;margin:auto;border-radius:16px;border:1px solid rgba(255,255,255,0.1)">
          <h2 style="color:#60A5FA;font-size:20px;margin-bottom:16px">Réponse de l'équipe GUARDIAN CYBER LABS</h2>
          <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:16px;margin-bottom:20px">
            <p style="color:#8A93A6;font-size:12px;margin:0 0 8px 0">Votre message original :</p>
            <p style="color:#94A3B8;font-size:13px;font-style:italic">"{msg.message}"</p>
          </div>
          <p style="color:#fff;font-size:14px;line-height:1.7;margin-bottom:24px">{payload.reply}</p>
          <p style="color:#64748B;font-size:12px">L'équipe GUARDIAN CYBER LABS</p>
        </div>
        """
    )

    msg.resolved = True
    db.commit()
    db.refresh(msg)
    return {"status": "replied", "to": msg.email}


@router.post("/admin/send", dependencies=[Depends(get_current_admin)])
def admin_send_message(payload: AdminMessage, db: Session = Depends(get_db)):
    users = db.query(User).filter(User.id.in_(payload.user_ids)).all()
    if not users:
        raise HTTPException(status_code=404, detail="Aucun utilisateur trouvé.")

    sent = []
    for user in users:
        send_email_sync(
            to=user.email,
            subject=payload.subject,
            body=f"""
            <div style="font-family:Inter,sans-serif;background:#05070D;color:#fff;padding:40px;max-width:600px;margin:auto;border-radius:16px;border:1px solid rgba(255,255,255,0.1)">
              <h2 style="color:#60A5FA;font-size:20px;margin-bottom:16px">{payload.subject}</h2>
              <p style="color:#fff;font-size:14px;line-height:1.7;white-space:pre-wrap">{payload.message}</p>
              <a href="https://guardian-cyber-labs.netlify.app" style="display:inline-block;margin-top:24px;background:linear-gradient(to right,#3B82F6,#1D4ED8);color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Accéder à la plateforme →</a>
              <p style="color:#64748B;font-size:12px;margin-top:32px">L'équipe GUARDIAN CYBER LABS</p>
            </div>
            """
        )
        sent.append(user.email)

    return {"status": "sent", "recipients": sent}