from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base
import secrets


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    code = Column(String, unique=True, index=True, default=lambda: secrets.token_hex(8))
    is_public = Column(Boolean, default=False)
    issued_at = Column(DateTime(timezone=True), server_default=func.now())