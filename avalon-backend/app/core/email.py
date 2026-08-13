import asyncio
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType

conf = ConnectionConfig(
    MAIL_USERNAME="avalonsecure7@gmail.com",
    MAIL_PASSWORD="mfrr yher qfgg llag",
    MAIL_FROM="avalonsecure7@gmail.com",
    MAIL_FROM_NAME="GUARDIAN CYBER LABS",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

fm = FastMail(conf)


async def send_email(to: str, subject: str, body: str):
    message = MessageSchema(
        subject=subject,
        recipients=[to],
        body=body,
        subtype=MessageType.html,
    )
    try:
        await fm.send_message(message)
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")


def send_email_sync(to: str, subject: str, body: str):
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            loop.create_task(send_email(to, subject, body))
        else:
            loop.run_until_complete(send_email(to, subject, body))
    except Exception as e:
        print(f"[EMAIL SYNC ERROR] {e}")


def email_bienvenue(prenom: str, email: str):
    send_email_sync(email, "Bienvenue sur GUARDIAN CYBER LABS 🛡️", f"""
    <div style="font-family:Inter,sans-serif;background:#05070D;color:#fff;padding:40px;max-width:600px;margin:auto;border-radius:16px;border:1px solid rgba(255,255,255,0.1)">
      <h1 style="color:#60A5FA;font-size:24px;margin-bottom:8px">Bienvenue, {prenom or 'cher apprenant'} 👋</h1>
      <p style="color:#8A93A6;font-size:14px;line-height:1.6">Ton compte GUARDIAN CYBER LABS a bien été créé. Tu peux dès maintenant explorer nos parcours en cybersécurité (Red Team, Blue Team, GRC) et commencer ta formation.</p>
      <a href="https://guardian-cyber-labs.netlify.app/catalog" style="display:inline-block;margin-top:24px;background:linear-gradient(to right,#3B82F6,#1D4ED8);color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Explorer les parcours →</a>
      <p style="color:#64748B;font-size:12px;margin-top:32px">GUARDIAN CYBER LABS — porté par AVALON SECURE</p>
    </div>
    """)


def email_paiement(prenom: str, email: str, course_title: str):
    send_email_sync(email, f"Accès débloqué : {course_title} 🎓", f"""
    <div style="font-family:Inter,sans-serif;background:#05070D;color:#fff;padding:40px;max-width:600px;margin:auto;border-radius:16px;border:1px solid rgba(255,255,255,0.1)">
      <h1 style="color:#60A5FA;font-size:24px;margin-bottom:8px">Accès confirmé ✅</h1>
      <p style="color:#8A93A6;font-size:14px;line-height:1.6">Bonjour {prenom or ''},<br><br>Ton accès au parcours <strong style="color:#fff">{course_title}</strong> a bien été activé. Tu peux commencer dès maintenant.</p>
      <a href="https://guardian-cyber-labs.netlify.app/dashboard" style="display:inline-block;margin-top:24px;background:linear-gradient(to right,#3B82F6,#1D4ED8);color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Accéder à mon apprentissage →</a>
      <p style="color:#64748B;font-size:12px;margin-top:32px">GUARDIAN CYBER LABS — porté par AVALON SECURE</p>
    </div>
    """)


def email_livrable_corrige(prenom: str, email: str, course_title: str, grade: int, feedback: str, status: str):
    couleur = "#10B981" if status == "validated" else "#F59E0B"
    statut_txt = "Validé ✅" if status == "validated" else "À revoir 🔄"
    send_email_sync(email, f"Ton livrable a été corrigé — {course_title}", f"""
    <div style="font-family:Inter,sans-serif;background:#05070D;color:#fff;padding:40px;max-width:600px;margin:auto;border-radius:16px;border:1px solid rgba(255,255,255,0.1)">
      <h1 style="color:{couleur};font-size:24px;margin-bottom:8px">Livrable corrigé — {statut_txt}</h1>
      <p style="color:#8A93A6;font-size:14px;line-height:1.6">Bonjour {prenom or ''},<br><br>Ton livrable pour le parcours <strong style="color:#fff">{course_title}</strong> a été corrigé.</p>
      <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:16px;margin:20px 0">
        <p style="color:#fff;font-size:16px;font-weight:700;margin:0">Note : {grade}/100</p>
        {f'<p style="color:#8A93A6;font-size:14px;margin-top:8px">{feedback}</p>' if feedback else ''}
      </div>
      <a href="https://guardian-cyber-labs.netlify.app/dashboard" style="display:inline-block;margin-top:8px;background:linear-gradient(to right,#3B82F6,#1D4ED8);color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Voir mon tableau de bord →</a>
      <p style="color:#64748B;font-size:12px;margin-top:32px">GUARDIAN CYBER LABS — porté par AVALON SECURE</p>
    </div>
    """)


def email_certificat(prenom: str, email: str, course_title: str, code: str):
    send_email_sync(email, f"Ton certificat est disponible 🏆 — {course_title}", f"""
    <div style="font-family:Inter,sans-serif;background:#05070D;color:#fff;padding:40px;max-width:600px;margin:auto;border-radius:16px;border:1px solid rgba(255,255,255,0.1)">
      <h1 style="color:#F59E0B;font-size:24px;margin-bottom:8px">Félicitations 🏆</h1>
      <p style="color:#8A93A6;font-size:14px;line-height:1.6">Bonjour {prenom or ''},<br><br>Tu as validé avec succès le parcours <strong style="color:#fff">{course_title}</strong>. Ton certificat officiel est maintenant disponible.</p>
      <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:16px;margin:20px 0">
        <p style="color:#8A93A6;font-size:12px;margin:0">Code de vérification</p>
        <p style="color:#60A5FA;font-size:18px;font-weight:700;font-family:monospace;margin:4px 0">{code}</p>
      </div>
      <a href="https://guardian-cyber-labs.netlify.app/profile" style="display:inline-block;margin-top:8px;background:linear-gradient(to right,#3B82F6,#1D4ED8);color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Télécharger mon certificat →</a>
      <p style="color:#64748B;font-size:12px;margin-top:32px">GUARDIAN CYBER LABS — porté par AVALON SECURE</p>
    </div>
    """)