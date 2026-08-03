from sqlalchemy import Column, Integer, String, Boolean, Text
from app.database import Base

class PaymentMethod(Base):
    __tablename__ = "payment_methods"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, nullable=False)  # "mtn", "wave", "card", "paypal"
    display_name = Column(String, nullable=False)
    logo_url = Column(String, nullable=True)
    receiving_info = Column(Text, nullable=True)  # ex: "Numéro MTN: 96 00 00 00"
    enabled = Column(Boolean, default=True)