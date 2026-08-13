import React, { useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LanguageContext } from '../context/LanguageContext';
import { API_URL } from '../config';

const Contact = () => {
  const { language } = useContext(LanguageContext);
  const fr = language === 'fr';
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(fr ? "Erreur lors de l'envoi." : 'Error sending message.');
      setSent(true);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen text-white flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-xl mx-auto px-6 py-20 w-full">
        <h1 className="font-display text-3xl font-bold mb-2 tracking-tight">
          {fr ? 'Nous contacter' : 'Contact us'}
        </h1>
        <p className="text-muted text-sm mb-10">
          {fr
            ? 'Une question, un problème d\'accès ou une demande de partenariat ? Écrivez-nous, nous répondons sous 24h.'
            : 'A question, an access issue or a partnership request? Write to us, we reply within 24h.'}
        </p>

        <div className="bg-surface border border-white/10 rounded-2xl p-8">
          {sent ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl mx-auto mb-5">✓</div>
              <h3 className="font-display text-white font-bold text-lg mb-2">
                {fr ? 'Message envoyé' : 'Message sent'}
              </h3>
              <p className="text-muted text-sm">
                {fr ? 'Nous vous répondrons dans les plus brefs délais.' : 'We will get back to you as soon as possible.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>
              )}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Email</label>
                <input name="email" type="email" placeholder={fr ? 'votre@email.com' : 'your@email.com'} required onChange={handleChange}
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                  {fr ? 'Objet' : 'Subject'}
                </label>
                <input name="subject" type="text" placeholder={fr ? 'Objet de votre message' : 'Subject of your message'} required onChange={handleChange}
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Message</label>
                <textarea name="message" placeholder={fr ? 'Votre message...' : 'Your message...'} rows="5" required onChange={handleChange}
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors resize-none"></textarea>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-sm transition-all">
                {loading ? (fr ? 'Envoi...' : 'Sending...') : (fr ? 'Envoyer le message' : 'Send message')}
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default Contact;