import re
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v):
        if v and not re.match(r'^[0-9+\s]+$', v):
            raise ValueError('Le numéro ne doit contenir que des chiffres.')
        return v

    @field_validator('first_name', 'last_name')
    @classmethod
    def validate_name(cls, v):
        if v and not re.match(r'^[a-zA-ZÀ-ÿ\s\-]+$', v):
            raise ValueError('Ce champ ne doit contenir que des lettres.')
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    role: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v):
        if v and not re.match(r'^[0-9+\s]+$', v):
            raise ValueError('Le numéro ne doit contenir que des chiffres.')
        return v

    @field_validator('first_name', 'last_name')
    @classmethod
    def validate_name(cls, v):
        if v and not re.match(r'^[a-zA-ZÀ-ÿ\s\-]+$', v):
            raise ValueError('Ce champ ne doit contenir que des lettres.')
        return v


class ConfirmPasswordChangeRequest(BaseModel):
    code: str
    new_password: str


class EnrollmentOut(BaseModel):
    course_id: int
    course_title: str
    thumbnail_url: Optional[str] = None
    payment_method: Optional[str] = None
    purchased_at: str
    completed_lessons: int
    total_lessons: int