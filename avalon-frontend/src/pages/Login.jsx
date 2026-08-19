import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { API_URL } from '../config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const fr = language === 'fr';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = new URLSearchParams();
      body.append('username', email);
      body.append('password', password);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || (fr ? 'Email ou mot de passe incorrect.' : 'Incorrect email or password.'));
      }
      const data = await res.json();
      login(data.access_token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center px-4 py-12">

      {/* Logo centré hors carte */}
      <Link to="/" className="flex items-center gap-2.5 mb-8">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" stroke="#3b6df0" strokeWidth="1.5" fill="rgba(59,109,240,0.08)" />
          <polygon points="16,8 24,12 24,20 16,24 8,20 8,12" stroke="#3b6df0" strokeWidth="1" fill="none" />
          <circle cx="16" cy="16" r="2.5" fill="#3b6df0" />
        </svg>
        <div className="flex flex-col leading-none">
          <span className="font-display text-xs font-bold tracking-widest text-white">GUARDIAN</span>
          <span className="font-display text-xs font-bold tracking-widest" style={{ color: '#3b6df0' }}>CYBER LABS</span>
        </div>
      </Link>

      {/* Carte */}
      <div className="w-full max-w-sm rounded-2xl p-8 relative"
        style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Toggle langue */}
        <button onClick={toggleLanguage}
          className="absolute top-5 right-5 font-mono text-[10px] font-semibold text-muted hover:text-white border border-white/10 px-2 py-1 rounded transition-colors">
          {language === 'fr' ? 'EN' : 'FR'}
        </button>

        {/* Label + Titre */}
        <p className="font-mono text-xs text-primary tracking-widest mb-2">[ AUTH ]</p>
        <h1 className="font-display text-2xl font-bold text-white mb-6">
          {fr ? 'Connexion' : 'Log in'}
        </h1>

        {error && (
          <div className="text-xs text-red-400 mb-4 px-3 py-2 rounded"
            style={{ background: 'rgba(169,68,66,0.1)', border: '1px solid rgba(169,68,66,0.3)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="email"
              placeholder={fr ? 'votre@email.com' : 'your@email.com'}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-lg text-sm text-white placeholder:text-muted outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={e => e.target.style.borderColor = 'rgba(59,109,240,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>

          {/* Mot de passe */}
          <div className="relative">
            <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={fr ? 'Mot de passe' : 'Password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-3 rounded-lg text-sm text-white placeholder:text-muted outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={e => e.target.style.borderColor = 'rgba(59,109,240,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors">
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Mot de passe oublié */}
          <div className="flex justify-end">
            <Link to="/forgot-password"
              className="font-mono text-[11px] transition-colors"
              style={{ color: '#4a7fc2' }}
              onMouseEnter={e => e.target.style.color = '#6090f8'}
              onMouseLeave={e => e.target.style.color = '#4a7fc2'}>
              {fr ? 'Mot de passe oublié ?' : 'Forgot password?'}
            </Link>
          </div>

          {/* Bouton */}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all"
            style={{ backgroundColor: '#3b6ea5', border: '1px solid rgba(59,110,165,0.4)' }}
            onMouseEnter={e => !loading && (e.target.style.backgroundColor = '#2a5a8a')}
            onMouseLeave={e => !loading && (e.target.style.backgroundColor = '#3b6ea5')}>
            {loading ? (fr ? 'Connexion...' : 'Logging in...') : (fr ? 'Se connecter' : 'Log in')}
          </button>
        </form>

        {/* Lien inscription */}
        <p className="text-center text-muted text-xs mt-6">
          {fr ? 'Pas encore de compte ? ' : 'No account yet? '}
          <Link to="/register" className="font-semibold transition-colors" style={{ color: '#4a7fc2' }}>
            {fr ? "S'inscrire" : 'Sign up'}
          </Link>
        </p>
      </div>

      {/* Retour accueil */}
      <Link to="/" className="mt-6 font-mono text-[11px] text-muted hover:text-white transition-colors">
        ← {fr ? "Retour à l'accueil" : 'Back to home'}
      </Link>
    </div>
  );
};
export default Login;