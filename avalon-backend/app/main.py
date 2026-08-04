from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database import Base, engine
from app.routers import auth, courses, payments, contact, uploads, admin, payment_methods, categories, exercises, submissions, certificates
Base.metadata.create_all(bind=engine)

os.makedirs("app/static/uploads", exist_ok=True)

app = FastAPI(title="Avalon Secure Academy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://guardian-cyber-labs.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(payments.router)
app.include_router(contact.router)
app.include_router(uploads.router)
app.include_router(admin.router)
app.include_router(payment_methods.router)
app.include_router(categories.router)
app.include_router(exercises.router)
app.include_router(submissions.router)
app.include_router(certificates.router)

@app.get("/")
def root():
    return {"status": "Avalon Secure Academy API en ligne"}