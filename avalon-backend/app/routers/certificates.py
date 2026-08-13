import io
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
from reportlab.lib.pagesizes import landscape, A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
import qrcode
import io as _io

from app.database import get_db
from app.models.certificates import Certificate
from app.models.course import Course
from app.models.user import User
from app.schemas.certificates import CertificateOut, PublicCertificateOut, CertificateVisibility
from app.core.security import get_current_user, get_current_admin
from app.core.email import email_certificat

router = APIRouter(prefix="/certificates", tags=["certificates"])

DOMAIN_LABELS = {"red_team": "Red Team", "blue_team": "Blue Team", "grc": "GRC"}
LEVEL_LABELS = {"beginner": "Débutant", "intermediate": "Intermédiaire", "advanced": "Avancé"}


def issue_certificate_if_needed(user_id: int, course_id: int, db: Session):
    existing = db.query(Certificate).filter(Certificate.user_id == user_id, Certificate.course_id == course_id).first()
    if existing:
        return existing
    cert = Certificate(user_id=user_id, course_id=course_id)
    db.add(cert)
    db.commit()
    db.refresh(cert)

    student = db.query(User).filter(User.id == user_id).first()
    course = db.query(Course).filter(Course.id == course_id).first()
    if student and course:
        email_certificat(
            student.first_name or '',
            student.email,
            course.title_fr,
            cert.code
        )
    return cert


@router.get("/me", response_model=List[CertificateOut])
def my_certificates(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = (
        db.query(Certificate, Course.title_fr)
        .join(Course, Certificate.course_id == Course.id)
        .filter(Certificate.user_id == current_user.id)
        .all()
    )
    return [
        CertificateOut(
            id=c.id, course_id=c.course_id, course_title=title, code=c.code,
            is_public=c.is_public, issued_at=c.issued_at.isoformat() if c.issued_at else "",
        )
        for c, title in rows
    ]


@router.put("/{certificate_id}/visibility", response_model=CertificateOut)
def set_visibility(certificate_id: int, payload: CertificateVisibility, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cert = db.query(Certificate).filter(Certificate.id == certificate_id, Certificate.user_id == current_user.id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificat introuvable.")
    cert.is_public = payload.is_public
    db.commit()
    db.refresh(cert)
    course = db.query(Course).filter(Course.id == cert.course_id).first()
    return CertificateOut(
        id=cert.id, course_id=cert.course_id, course_title=course.title_fr if course else "",
        code=cert.code, is_public=cert.is_public, issued_at=cert.issued_at.isoformat() if cert.issued_at else "",
    )


@router.get("/public", response_model=List[PublicCertificateOut])
def public_certificates(db: Session = Depends(get_db)):
    rows = (
        db.query(Certificate, User.first_name, User.last_name, Course.title_fr, Course.domain, Course.level)
        .join(User, Certificate.user_id == User.id)
        .join(Course, Certificate.course_id == Course.id)
        .filter(Certificate.is_public == True)
        .order_by(Certificate.issued_at.desc())
        .all()
    )
    return [
        PublicCertificateOut(
            code=c.code,
            student_name=f"{first or ''} {last or ''}".strip() or "Étudiant",
            course_title=title, domain=domain, level=level,
            issued_at=c.issued_at.isoformat() if c.issued_at else "",
        )
        for c, first, last, title, domain, level in rows
    ]


@router.get("/verify/{code}", response_model=PublicCertificateOut)
def verify_certificate(code: str, db: Session = Depends(get_db)):
    row = (
        db.query(Certificate, User.first_name, User.last_name, Course.title_fr, Course.domain, Course.level)
        .join(User, Certificate.user_id == User.id)
        .join(Course, Certificate.course_id == Course.id)
        .filter(Certificate.code == code)
        .first()
    )
    if not row:
        raise HTTPException(status_code=404, detail="Certificat introuvable.")
    c, first, last, title, domain, level = row
    return PublicCertificateOut(
        code=c.code, student_name=f"{first or ''} {last or ''}".strip() or "Étudiant",
        course_title=title, domain=domain, level=level,
        issued_at=c.issued_at.isoformat() if c.issued_at else "",
    )


@router.get("/{certificate_id}/pdf")
def download_certificate_pdf(certificate_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cert = db.query(Certificate).filter(Certificate.id == certificate_id, Certificate.user_id == current_user.id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificat introuvable.")
    course = db.query(Course).filter(Course.id == cert.course_id).first()
    student_name = f"{current_user.first_name or ''} {current_user.last_name or ''}".strip() or current_user.email

    verify_url = f"https://guardian-cyber-labs.netlify.app/certificates/verify/{cert.code}"
    qr = qrcode.QRCode(version=1, box_size=4, border=2)
    qr.add_data(verify_url)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="#3B82F6", back_color="#0A0E1A")
    qr_buffer = _io.BytesIO()
    qr_img.save(qr_buffer, format='PNG')
    qr_buffer.seek(0)

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=landscape(A4))
    width, height = landscape(A4)

    c.setFillColor(HexColor("#0A0E1A"))
    c.rect(0, 0, width, height, fill=1)

    c.setStrokeColor(HexColor("#3B82F6"))
    c.setLineWidth(3)
    c.rect(1.5 * cm, 1.5 * cm, width - 3 * cm, height - 3 * cm)

    c.setFillColor(HexColor("#60A5FA"))
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width / 2, height - 3.2 * cm, "GUARDIAN CYBER LABS")

    c.setFillColor(HexColor("#94A3B8"))
    c.setFont("Helvetica", 11)
    c.drawCentredString(width / 2, height - 4 * cm, "Certificat de réussite")

    c.setFillColor(HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(width / 2, height / 2 + 1 * cm, student_name)

    c.setFillColor(HexColor("#94A3B8"))
    c.setFont("Helvetica", 13)
    c.drawCentredString(width / 2, height / 2 - 0.5 * cm, "a validé avec succès le parcours")

    c.setFillColor(HexColor("#60A5FA"))
    c.setFont("Helvetica-Bold", 18)
    domain_label = DOMAIN_LABELS.get(course.domain, course.domain) if course else ""
    level_label = LEVEL_LABELS.get(course.level, course.level) if course else ""
    c.drawCentredString(width / 2, height / 2 - 1.6 * cm, f"{course.title_fr if course else ''} — {domain_label} · {level_label}")

    qr_size = 2.5 * cm
    qr_x = width - 1.5 * cm - qr_size - 0.5 * cm
    qr_y = 1.8 * cm
    c.drawImage(ImageReader(qr_buffer), qr_x, qr_y, width=qr_size, height=qr_size)

    c.setFillColor(HexColor("#64748B"))
    c.setFont("Helvetica", 9)
    c.drawCentredString(width / 2, 2.5 * cm, f"Code de vérification : {cert.code}")
    c.drawCentredString(width / 2, 2 * cm, f"Délivré le {cert.issued_at.strftime('%d/%m/%Y') if cert.issued_at else ''}")

    c.showPage()
    c.save()
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="application/pdf", headers={
        "Content-Disposition": f"attachment; filename=certificat_{cert.code}.pdf"
    })