import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [resetLink, setResetLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const data = await res.json();
      setResetLink(data.reset_link || '');
      setSent(true);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-black text-[#0A0E1A] text-xl">G</div>
        </div>
        {!sent ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-1">Mot de passe oublié</h2>
            <p className="text-slate-500 text-sm mb-8">Entre ton email, on t'envoie un lien de réinitialisation.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="email" placeholder="toi@exemple.com" required onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-900/60 border border-slate-800 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors" />
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-semibold py-3 rounded-lg text-sm transition-colors">{loading ? 'Envoi...' : 'Envoyer le lien'}</button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl mx-auto mb-5">✓</div>
            <h2 className="text-white font-bold text-lg mb-2">Lien généré</h2>
            <p className="text-slate-400 text-sm mb-6">Si un compte existe avec cet email, voici le lien (simulation) :</p>
            {resetLink && <a href={resetLink} className="block bg-slate-900/60 border border-slate-800 rounded-lg p-4 text-blue-400 text-xs break-all mb-4 hover:border-blue-500 transition-colors">{resetLink}</a>}
          </div>
        )}
        <p className="text-center text-slate-500 text-sm mt-8"><Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">← Retour à la connexion</Link></p>
      </div>
    </div>
  );
};
export default ForgotPassword;