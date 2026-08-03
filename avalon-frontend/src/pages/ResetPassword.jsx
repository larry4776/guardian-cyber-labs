import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { API_URL } from '../config';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, new_password: password }) });
      if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data.detail || 'Erreur lors de la réinitialisation.'); }
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  if (!token) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">Lien invalide. <Link to="/forgot-password" className="text-blue-400 ml-1">Redemander un lien</Link></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-black text-[#0A0E1A] text-xl">G</div>
        </div>
        {success ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl mx-auto mb-5">✓</div>
            <h2 className="text-white font-bold text-lg mb-2">Mot de passe changé</h2>
            <p className="text-slate-400 text-sm">Redirection vers la connexion...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-1">Nouveau mot de passe</h2>
            <p className="text-slate-500 text-sm mb-8">Choisis un nouveau mot de passe.</p>
            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Nouveau mot de passe" required onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900/60 border border-slate-800 text-white px-4 py-3 pr-11 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
              <div className="relative">
                <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirmer le mot de passe" required onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-slate-900/60 border border-slate-800 text-white px-4 py-3 pr-11 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-semibold py-3 rounded-lg text-sm transition-colors">{loading ? 'Enregistrement...' : 'Réinitialiser le mot de passe'}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
export default ResetPassword;