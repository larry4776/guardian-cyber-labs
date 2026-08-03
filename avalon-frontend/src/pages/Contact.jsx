import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { API_URL } from '../config';

const Contact = () => {
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
      const res = await fetch(`${API_URL}/contact/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error("Erreur lors de l'envoi du message.");
      setSent(true);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen text-slate-300">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-white mb-1">Support technique</h1>
        <p className="text-slate-500 text-sm mb-8">Une question, un problème d'accès ? Écris-nous.</p>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 mb-8 font-mono text-xs border-l-2 border-l-blue-500 space-y-1">
          <p className="text-slate-400">ENDPOINT: <span className="text-blue-400">avalonsecure7@gmail.com</span></p>
          <p className="text-slate-400">STATUS: <span className="text-emerald-400">ACTIVE</span></p>
          <p className="text-slate-400">RESPONSE_TIME: <span className="text-slate-200">24H</span></p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl mx-auto mb-4">✓</div>
              <h3 className="text-white font-bold mb-1">Message envoyé</h3>
              <p className="text-slate-500 text-sm">On te répond sous 24h.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>}
              <input name="email" type="email" placeholder="Ton email" required onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors" />
              <input name="subject" type="text" placeholder="Objet de la demande" required onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors" />
              <textarea name="message" placeholder="Ton message..." rows="5" required onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-semibold py-3 rounded-lg text-sm transition-colors">{loading ? 'Envoi...' : 'Envoyer le message'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default Contact;