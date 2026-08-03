import os
import shutil
import uuid
from fastapi import APIRouter, Depends, UploadFile, File
from app.core.security import get_current_admin

router = APIRouter(prefix="/uploads", tags=["uploads"])

UPLOAD_DIR = "app/static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def _save_file(file: UploadFile) -> str:
    ext = os.path.splitext(file.filename)[1]
    unique_name = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(UPLOAD_DIR, unique_name)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return f"/static/uploads/{unique_name}"


@router.post("/image", dependencies=[Depends(get_current_admin)])
def upload_image(file: UploadFile = File(...)):
    url = _save_file(file)
    return {"url": url}


@router.post("/video", dependencies=[Depends(get_current_admin)])
def upload_video(file: UploadFile = File(...)):
    url = _save_file(file)
    return {"url": url}


@router.post("/file", dependencies=[Depends(get_current_admin)])
def upload_file(file: UploadFile = File(...)):
    url = _save_file(file)
    return {"url": url}