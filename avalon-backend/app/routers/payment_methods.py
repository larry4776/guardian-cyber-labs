from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.payment_method import PaymentMethod
from app.schemas.payment_method import PaymentMethodOut, PaymentMethodUpdate
from app.core.security import get_current_admin

router = APIRouter(prefix="/payment-methods", tags=["payment-methods"])


@router.get("/", response_model=List[PaymentMethodOut])
def list_payment_methods(db: Session = Depends(get_db)):
    return db.query(PaymentMethod).filter(PaymentMethod.enabled == True).all()


@router.get("/all", response_model=List[PaymentMethodOut], dependencies=[Depends(get_current_admin)])
def list_all_payment_methods(db: Session = Depends(get_db)):
    return db.query(PaymentMethod).all()


@router.put("/{key}", response_model=PaymentMethodOut, dependencies=[Depends(get_current_admin)])
def update_payment_method(key: str, payload: PaymentMethodUpdate, db: Session = Depends(get_db)):
    method = db.query(PaymentMethod).filter(PaymentMethod.key == key).first()
    if not method:
        raise HTTPException(status_code=404, detail="Moyen de paiement introuvable.")
    method.display_name = payload.display_name
    method.logo_url = payload.logo_url
    method.receiving_info = payload.receiving_info
    method.enabled = payload.enabled
    db.commit()
    db.refresh(method)
    return method