from pydantic import BaseModel
from typing import Optional


class PaymentMethodOut(BaseModel):
    id: int
    key: str
    display_name: str
    logo_url: Optional[str] = None
    receiving_info: Optional[str] = None
    enabled: bool

    class Config:
        from_attributes = True


class PaymentMethodUpdate(BaseModel):
    display_name: str
    logo_url: Optional[str] = None
    receiving_info: Optional[str] = None
    enabled: bool = True