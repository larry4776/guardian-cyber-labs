from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.course import Course, Lesson
from app.models.payment_method import PaymentMethod
from app.core.security import hash_password
import sqlite3
import os

Base.metadata.create_all(bind=engine)

# ── Migration automatique des colonnes manquantes ──────────────────────────
def migrate_columns():
    db_path = "academy.db"
    if not os.path.exists(db_path):
        db_path = "app.db"
    if not os.path.exists(db_path):
        # Cherche dans le dossier courant
        for f in os.listdir('.'):
            if f.endswith('.db'):
                db_path = f
                break

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Colonnes à ajouter dans la table courses
        courses_columns = [
            ("instructor_avatar", "TEXT"),
            ("resume_pdf_url", "TEXT"),
            ("tp_pdf_url", "TEXT"),
        ]
        for col, col_type in courses_columns:
            try:
                cursor.execute(f"ALTER TABLE courses ADD COLUMN {col} {col_type}")
                print(f"✓ Migration : colonne courses.{col} ajoutée")
            except sqlite3.OperationalError:
                pass  # Colonne déjà existante

        # Colonnes à ajouter dans la table lessons
        lessons_columns = [
            ("video_url_en", "TEXT"),
            ("skill_tags", "TEXT"),
        ]
        for col, col_type in lessons_columns:
            try:
                cursor.execute(f"ALTER TABLE lessons ADD COLUMN {col} {col_type}")
                print(f"✓ Migration : colonne lessons.{col} ajoutée")
            except sqlite3.OperationalError:
                pass  # Colonne déjà existante

        # Colonnes à ajouter dans la table users
        users_columns = [
            ("reset_token", "TEXT"),
            ("reset_token_expiry", "TEXT"),
            ("phone", "TEXT"),
            ("country", "TEXT"),
        ]
        for col, col_type in users_columns:
            try:
                cursor.execute(f"ALTER TABLE users ADD COLUMN {col} {col_type}")
                print(f"✓ Migration : colonne users.{col} ajoutée")
            except sqlite3.OperationalError:
                pass

        # Table settings si elle n'existe pas
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key TEXT UNIQUE NOT NULL,
                value TEXT NOT NULL
            )
        """)
        print("✓ Migration : table settings vérifiée")

        conn.commit()
        conn.close()
        print("✓ Migration terminée.")
    except Exception as e:
        print(f"[MIGRATION WARNING] {e}")

migrate_columns()

# ── Seed data ──────────────────────────────────────────────────────────────
db = SessionLocal()

admin = db.query(User).filter(User.email == "admin@avalon.com").first()
if not admin:
    admin = User(
        email="admin@avalon.com",
        hashed_password=hash_password("admin123"),
        first_name="Larry",
        role="admin"
    )
    db.add(admin)
    db.commit()
    print("✓ Compte admin créé : admin@avalon.com / admin123")

courses_data = [
    {"title_fr": "Red Team — Fondations", "title_en": "Red Team — Foundations", "domain": "red_team", "level": "beginner", "price": 49,
     "description_fr": "Introduction à la méthodologie de test d'intrusion et prise en main des outils essentiels.",
     "description_en": "Introduction to penetration testing methodology and hands-on with essential tools."},
    {"title_fr": "Red Team — Intermédiaire", "title_en": "Red Team — Intermediate", "domain": "red_team", "level": "intermediate", "price": 99,
     "description_fr": "Exploitation avancée et rédaction de rapports d'audit professionnels.",
     "description_en": "Advanced exploitation and professional audit report writing."},
    {"title_fr": "Red Team — Avancé", "title_en": "Red Team — Advanced", "domain": "red_team", "level": "advanced", "price": 149,
     "description_fr": "Scénarios d'intrusion complexes et techniques offensives poussées.",
     "description_en": "Complex intrusion scenarios and advanced offensive techniques."},
    {"title_fr": "Blue Team — Fondations", "title_en": "Blue Team — Foundations", "domain": "blue_team", "level": "beginner", "price": 49,
     "description_fr": "Bases de la supervision (SIEM) et lecture d'alertes de sécurité.",
     "description_en": "SIEM monitoring basics and reading security alerts."},
    {"title_fr": "Blue Team — Intermédiaire", "title_en": "Blue Team — Intermediate", "domain": "blue_team", "level": "intermediate", "price": 99,
     "description_fr": "Méthodologie de réponse à incident et rédaction de rapports.",
     "description_en": "Incident response methodology and report writing."},
    {"title_fr": "Blue Team — Avancé", "title_en": "Blue Team — Advanced", "domain": "blue_team", "level": "advanced", "price": 149,
     "description_fr": "Détection avancée et gestion d'incidents complexes.",
     "description_en": "Advanced detection and complex incident management."},
    {"title_fr": "GRC — Fondations", "title_en": "GRC — Foundations", "domain": "grc", "level": "beginner", "price": 49,
     "description_fr": "Introduction aux cadres normatifs (ISO 27001 simplifié) et à l'audit.",
     "description_en": "Introduction to regulatory frameworks (simplified ISO 27001) and auditing."},
    {"title_fr": "GRC — Intermédiaire", "title_en": "GRC — Intermediate", "domain": "grc", "level": "intermediate", "price": 99,
     "description_fr": "Gestion des risques et rédaction de dossiers de conformité.",
     "description_en": "Risk management and compliance file writing."},
    {"title_fr": "GRC — Avancé", "title_en": "GRC — Advanced", "domain": "grc", "level": "advanced", "price": 149,
     "description_fr": "Audit complexe et pilotage de la conformité en entreprise.",
     "description_en": "Complex auditing and enterprise compliance management."},
]

for c in courses_data:
    existing = db.query(Course).filter(Course.title_fr == c["title_fr"]).first()
    if existing:
        continue
    course = Course(
        title_fr=c["title_fr"], title_en=c["title_en"],
        description_fr=c["description_fr"], description_en=c["description_en"],
        price=c["price"], is_free=False, domain=c["domain"], level=c["level"], status="published",
        instructor_name="DEGBOE Larry",
        thumbnail_url="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600",
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    db.add(Lesson(
        course_id=course.id,
        title_fr="Introduction au module",
        title_en="Module introduction",
        duration="10:00",
        order=1
    ))
    db.commit()
    print(f"✓ Parcours créé : {course.title_fr}")

payment_methods_data = [
    {"key": "mtn", "display_name": "MTN Mobile Money", "receiving_info": "À configurer"},
    {"key": "wave", "display_name": "Wave", "receiving_info": "À configurer"},
    {"key": "card", "display_name": "Carte Bancaire", "receiving_info": "À configurer"},
    {"key": "paypal", "display_name": "PayPal", "receiving_info": "À configurer"},
]
for pm in payment_methods_data:
    existing = db.query(PaymentMethod).filter(PaymentMethod.key == pm["key"]).first()
    if existing:
        continue
    db.add(PaymentMethod(**pm))
    db.commit()
    print(f"✓ Moyen de paiement créé : {pm['display_name']}")

db.close()
print("Terminé.")