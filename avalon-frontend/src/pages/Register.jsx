import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { API_URL } from '../config';
import { countries } from '../data/countries';

const validatePassword = (password) => ({
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  number: /[0-9]/.test(password),
  special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
});

const Register = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', country: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const { login } = useContext(AuthContext);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const fr = language === 'fr';

  const passwordRules = validatePassword(formData.password);
  const isPasswordStrong = Object.values(passwordRules).every(Boolean);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.country_name) {
          const found = countries.find(c => c.name.toLowerCase().includes(data.country_name.toLowerCase()));
          if (found) setFormData(prev => ({ ...prev, country: found.name }));
        }
      }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isPasswordStrong) {
      setError(fr ? 'Le mot de passe ne respecte pas les critères.' : 'Password does not meet requirements.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          country: formData.country,
          phone: formData.phone,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || (fr ? "Erreur lors de l'inscription." : 'Registration error.'));
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

      {/* Logo */}
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
        <p className="font-mono text-xs text-primary tracking-widest mb-2">[ REGISTER ]</p>
        <h1 className="font-display text-2xl font-bold text-white mb-6">
          {fr ? 'Créer un compte' : 'Create an account'}
        </h1>

        {error && (
          <div className="text-xs text-red-400 mb-4 px-3 py-2 rounded"
            style={{ background: 'rgba(169,68,66,0.1)', border: '1px solid rgba(169,68,66,0.3)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nom complet */}
          <div className="relative">
            <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder={fr ? 'Votre nom complet' : 'Your full name'}
              required
              value={`${formData.firstName} ${formData.lastName}`.trim()}
              onChange={(e) => {
                const parts = e.target.value.split(' ');
                setFormData({ ...formData, firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || '' });
              }}
              className="w-full pl-11 pr-4 py-3 rounded-lg text-sm text-white placeholder:text-muted outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={e => e.target.style.borderColor = 'rgba(59,109,240,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="email"
              placeholder={fr ? 'votre@email.com' : 'your@email.com'}
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              onFocus={() => setShowRules(true)}
              onBlur={() => setShowRules(false)}
              className="w-full pl-11 pr-11 py-3 rounded-lg text-sm text-white placeholder:text-muted outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors">
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Barre de force */}
          {formData.password.length > 0 && (
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(Object.values(passwordRules).filter(Boolean).length / 4) * 100}%`,
                  backgroundColor: isPasswordStrong ? '#6a9e6a' : Object.values(passwordRules).filter(Boolean).length >= 2 ? '#c9a94e' : '#a94442'
                }} />
            </div>
          )}

          {/* Règles mot de passe */}
          {(showRules || formData.password.length > 0) && (
            <div className="space-y-1 px-1">
              {[
                { ok: passwordRules.length, label: fr ? '8 caractères minimum' : 'At least 8 characters' },
                { ok: passwordRules.uppercase, label: fr ? '1 majuscule' : '1 uppercase' },
                { ok: passwordRules.number, label: fr ? '1 chiffre' : '1 number' },
                { ok: passwordRules.special, label: fr ? '1 caractère spécial' : '1 special character' },
              ].map((r, i) => (
                <p key={i} className="font-mono text-[10px] flex items-center gap-1.5"
                  style={{ color: r.ok ? '#6a9e6a' : '#8A93A6' }}>
                  {r.ok ? '✓' : '○'} {r.label}
                </p>
              ))}
            </div>
          )}

          {/* Bouton */}
          <button type="submit" disabled={loading || !isPasswordStrong}
            className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all mt-2"
            style={{
              backgroundColor: loading || !isPasswordStrong ? 'rgba(59,110,165,0.4)' : '#3b6ea5',
              border: '1px solid rgba(59,110,165,0.4)',
              cursor: loading || !isPasswordStrong ? 'not-allowed' : 'pointer'
            }}>
            {loading ? (fr ? 'Création...' : 'Creating...') : (fr ? 'Créer mon compte' : 'Create my account')}
          </button>
        </form>

        {/* Lien connexion */}
        <div className="text-center mt-5">
          <Link to="/login" className="font-mono text-[11px] text-muted hover:text-white transition-colors">
            ← {fr ? 'Retour à la connexion' : 'Back to login'}
          </Link>
        </div>
      </div>

      {/* Retour accueil */}
      <Link to="/" className="mt-6 font-mono text-[11px] text-muted hover:text-white transition-colors">
        ← {fr ? "Retour à l'accueil" : 'Back to home'}
      </Link>
    </div>
  );
};
export default Register;