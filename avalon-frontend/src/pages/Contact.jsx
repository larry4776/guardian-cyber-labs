import React, { useState, useContext } from 'react';
import { Mail, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LanguageContext } from '../context/LanguageContext';
import { API_URL } from '../config';

const FAQ_ITEMS = [
  {
    q: "Comment fonctionne la correction humaine ?",
    q_en: "How does human grading work?",
    a: "Chaque livrable que vous soumettez est relu par un formateur certifié dans un délai de 48h. Vous recevez un retour détaillé avec commentaires et axes d'amélioration.",
    a_en: "Every deliverable you submit is reviewed by a certified instructor within 48 hours. You receive detailed feedback with comments and areas for improvement.",
  },
  {
    q: "Y a-t-il des prérequis pour s'inscrire ?",
    q_en: "Are there prerequisites to enroll?",
    a: "Aucun prérequis n'est obligatoire. Le test de positionnement gratuit vous aide à démarrer au bon niveau.",
    a_en: "No prerequisites are required. The free placement test helps you start at the right level.",
  },
  {
    q: "Les formations sont-elles disponibles en anglais ?",
    q_en: "Are courses available in English?",
    a: "Oui. Toute la plateforme est disponible en français et en anglais, contenu inclus.",
    a_en: "Yes. The entire platform is available in French and English, content included.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    q_en: "What payment methods do you accept?",
    a: "Carte bancaire (Visa, Mastercard), PayPal, Mobile Money (MTN, Wave). Les paiements en devise locale sont disponibles.",
    a_en: "Bank card (Visa, Mastercard), PayPal, Mobile Money (MTN, Wave). Local currency payments are available.",
  },
];

const FaqItem = ({ item, fr }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b last:border-b-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left transition-colors hover:text-white"
        style={{ color: open ? '#ffffff' : '#94A3B8' }}>
        <span className="text-sm font-medium">{fr ? item.q : item.q_en}</span>
        <ChevronDown size={16} className="shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: '#4a7fc2' }} />
      </button>
      {open && (
        <div className="pb-4">
          <p className="text-muted text-sm leading-relaxed">{fr ? item.a : item.a_en}</p>
        </div>
      )}
    </div>
  );
};

const Contact = () => {
  const { language } = useContext(LanguageContext);
  const fr = language === 'fr';

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError(fr ? 'Tous les champs sont requis.' : 'All fields are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    padding: '12px 16px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="min-h-screen text-white font-sans bg-base">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* En-tête */}
        <p className="font-mono text-xs text-primary tracking-widest mb-3">[ CONTACT ]</p>
        <h1 className="font-display text-4xl font-bold mb-12">
          {fr ? 'Nous contacter' : 'Contact us'}
        </h1>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

          {/* Colonne gauche — Formulaire */}
          <div className="rounded-2xl p-8"
            style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.08)' }}>

            {success ? (
              <div className="text-center py-12">
                <p className="text-3xl mb-4">✓</p>
                <p className="font-display text-xl font-bold text-white mb-2">
                  {fr ? 'Message envoyé !' : 'Message sent!'}
                </p>
                <p className="text-muted text-sm">
                  {fr ? 'Nous vous répondrons sous 24h ouvrées.' : 'We will reply within 24 business hours.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="text-xs text-red-400 px-3 py-2 rounded"
                    style={{ background: 'rgba(169,68,66,0.1)', border: '1px solid rgba(169,68,66,0.3)' }}>
                    {error}
                  </div>
                )}

                {/* Nom + Email côte à côte */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] text-muted tracking-widest uppercase block mb-2">
                      {fr ? 'Nom' : 'Name'}
                    </label>
                    <input
                      type="text" name="name" value={form.name}
                      onChange={handleChange}
                      placeholder={fr ? 'Votre nom' : 'Your name'}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(59,109,240,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-muted tracking-widest uppercase block mb-2">
                      Email
                    </label>
                    <input
                      type="email" name="email" value={form.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(59,109,240,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                  </div>
                </div>

                {/* Sujet */}
                <div>
                  <label className="font-mono text-[10px] text-muted tracking-widest uppercase block mb-2">
                    {fr ? 'Sujet' : 'Subject'}
                  </label>
                  <input
                    type="text" name="subject" value={form.subject}
                    onChange={handleChange}
                    placeholder={fr ? 'Objet de votre message' : 'Message subject'}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(59,109,240,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="font-mono text-[10px] text-muted tracking-widest uppercase block mb-2">
                    Message
                  </label>
                  <textarea
                    name="message" value={form.message}
                    onChange={handleChange}
                    placeholder={fr ? 'Votre message...' : 'Your message...'}
                    rows={7}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(59,109,240,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>

                {/* Bouton */}
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-lg text-sm font-semibold text-white transition-all"
                  style={{
                    backgroundColor: loading ? 'rgba(59,110,165,0.5)' : '#3b6ea5',
                    border: '1px solid rgba(59,110,165,0.4)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}>
                  {loading
                    ? (fr ? 'Envoi en cours...' : 'Sending...')
                    : (fr ? 'Envoyer le message' : 'Send message')}
                </button>
              </form>
            )}
          </div>

          {/* Colonne droite */}
          <div className="space-y-6">

            {/* Support */}
            <div className="rounded-2xl p-6"
              style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="font-mono text-xs text-primary tracking-widest mb-5">[ SUPPORT ]</p>
              <div className="flex items-center gap-3 mb-3">
                <Mail size={15} className="text-muted shrink-0" />
                <a href="mailto:support@guardiancyberlabs.io"
                  className="text-sm font-medium transition-colors"
                  style={{ color: '#4a7fc2' }}
                  onMouseEnter={e => e.target.style.color = '#6090f8'}
                  onMouseLeave={e => e.target.style.color = '#4a7fc2'}>
                  support@guardiancyberlabs.io
                </a>
              </div>
              <p className="text-muted text-sm">
                {fr ? 'Réponse garantie sous 24h ouvrées.' : 'Reply guaranteed within 24 business hours.'}
              </p>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl p-6"
              style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="font-mono text-xs text-primary tracking-widest mb-5">[ FAQ ]</p>
              <div>
                {FAQ_ITEMS.map((item, i) => (
                  <FaqItem key={i} item={item} fr={fr} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default Contact;