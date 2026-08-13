import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Check, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { API_URL } from '../config';
import { countries } from '../data/countries';

const validatePassword = (password) => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
};

const Register = () => {
  const [phase, setPhase] = useState('form');
  const [agreed, setAgreed] = useState(false);
  const [code, setCode] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pendingAuth, setPendingAuth] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const { login } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const fr = language === 'fr';

  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    firstName: '', lastName: '', country: '', phone: ''
  });

  // Détection automatique du pays
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.country_name) {
          const found = countries.find(c =>
            c.name.toLowerCase().includes(data.country_name.toLowerCase()) ||
            data.country_name.toLowerCase().includes(c.name.toLowerCase())
          );
          if (found) {
            setFormData(prev => ({ ...prev, country: found.name }));
          }
        }
      })
      .catch(() => {});
  }, []);

  const passwordRules = validatePassword(formData.password);
  const isPasswordStrong = Object.values(passwordRules).every(Boolean);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setPasswordError('');
  };
  const handleNameChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.replace(/[^a-zA-ZÀ-ÿ\s-]/g, '') });
  };
  const handlePhoneChange = (e) => {
    setFormData({ ...formData, phone: e.target.value.replace(/[^0-9+\s]/g, '') });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!isPasswordStrong) {
      setPasswordError(fr
        ? 'Le mot de passe ne respecte pas les critères de sécurité.'
        : 'Password does not meet security requirements.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError(fr ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.');
      return;
    }

    setSubmitting(true);
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
        throw new Error(data.detail || (fr ? "Erreur lors de l'inscription." : 'Error during registration.'));
      }
      const data = await res.json();
      setPendingAuth({ token: data.access_token, user: data.user });
      startVerification();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startVerification = () => {
    setPhase('verify');
    setCooldown(60);
    const timer = setInterval(() => {
      setCooldown(c => { if (c <= 1) { clearInterval(timer); return 0; } return c - 1; });
    }, 1000);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (pendingAuth) login(pendingAuth.token, pendingAuth.user);
    setPhase('done');
  };

  const RuleItem = ({ ok, label }) => (
    <div className={`flex items-center gap-2 text-xs ${ok ? 'text-emerald-400' : 'text-slate-500'}`}>
      {ok ? <Check size={12} /> : <X size={12} />}
      {label}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_10%,transparent_100%)]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/20 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="relative w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-light to-accent flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            <Shield size={20} className="text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            GUARDIAN <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">CYBER LABS</span>
          </span>
        </div>

        <div className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">

          {phase === 'form' && (
            <>
              <h2 className="font-display text-2xl font-bold text-white mb-1 text-center">
                {fr ? 'Créer un compte' : 'Create an account'}
              </h2>
              <p className="text-muted text-sm mb-6 text-center">
                {fr ? 'Rejoins GUARDIAN CYBER LABS.' : 'Join GUARDIAN CYBER LABS.'}
              </p>

              {serverError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">{serverError}</div>
              )}

              <label className="flex items-start gap-3 bg-white/[0.02] border border-white/10 rounded-lg p-4 cursor-pointer mb-5">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 accent-primary shrink-0" />
                <span className="text-xs text-slate-400 leading-relaxed">
                  {fr
                    ? <>J'accepte les <Link to="/conditions" className="text-primary-light hover:underline">conditions d'utilisation</Link> et m'engage à utiliser les compétences acquises dans un cadre légal.</>
                    : <>I accept the <Link to="/conditions" className="text-primary-light hover:underline">terms of use</Link> and commit to using acquired skills within a legal framework.</>
                  }
                </span>
              </label>

              <fieldset disabled={!agreed} className={!agreed ? 'opacity-40' : ''}>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input name="firstName" type="text" placeholder={fr ? 'Prénom' : 'First name'} required value={formData.firstName} onChange={handleNameChange}
                      className="bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />
                    <input name="lastName" type="text" placeholder={fr ? 'Nom' : 'Last name'} required value={formData.lastName} onChange={handleNameChange}
                      className="bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />
                  </div>

                  <input name="email" type="email" placeholder="toi@exemple.com" required onChange={handleChange}
                    className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />

                  <div className="relative">
                    <input name="password" type={showPassword ? 'text' : 'password'}
                      placeholder={fr ? 'Mot de passe' : 'Password'} required onChange={handleChange}
                      onFocus={() => setShowPasswordRules(true)}
                      onBlur={() => setShowPasswordRules(false)}
                      className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 pr-11 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-slate-300">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Barre de force */}
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        Object.values(passwordRules).filter(Boolean).length === 4 ? 'bg-emerald-500' :
                        Object.values(passwordRules).filter(Boolean).length >= 2 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(Object.values(passwordRules).filter(Boolean).length / 4) * 100}%` }}
                    />
                  </div>

                  {/* Règles du mot de passe */}
                  {(showPasswordRules || formData.password.length > 0) && (
                    <div className="bg-white/[0.02] border border-white/10 rounded-lg p-3 space-y-1.5">
                      <RuleItem ok={passwordRules.length} label={fr ? '8 caractères minimum' : 'At least 8 characters'} />
                      <RuleItem ok={passwordRules.uppercase} label={fr ? '1 lettre majuscule' : '1 uppercase letter'} />
                      <RuleItem ok={passwordRules.number} label={fr ? '1 chiffre' : '1 number'} />
                      <RuleItem ok={passwordRules.special} label={fr ? '1 caractère spécial (!@#$%...)' : '1 special character (!@#$%...)'} />
                    </div>
                  )}

                  <div className="relative">
                    <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={fr ? 'Confirmer le mot de passe' : 'Confirm password'} required onChange={handleChange}
                      className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 pr-11 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-slate-300">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {passwordError && <p className="text-red-400 text-xs">{passwordError}</p>}

                  <div className="grid grid-cols-2 gap-3">
                    <select name="country" required onChange={handleChange} value={formData.country}
                      className="bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors">
                      <option value="">{fr ? 'Pays' : 'Country'}</option>
                      {countries.map(c => <option key={c.name} value={c.name}>{c.name} ({c.code})</option>)}
                    </select>
                    <input name="phone" type="tel" placeholder={fr ? 'Téléphone' : 'Phone'} required value={formData.phone} onChange={handlePhoneChange}
                      className="bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />
                  </div>

                  <button type="submit" disabled={!agreed || submitting || !isPasswordStrong}
                    className="w-full bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:shadow-none text-white font-semibold py-3 rounded-lg text-sm transition-all mt-2">
                    {submitting ? (fr ? 'Création...' : 'Creating...') : (fr ? 'Créer mon compte' : 'Create my account')}
                  </button>
                </form>
              </fieldset>

              <p className="text-center text-muted text-sm mt-6">
                {fr ? 'Déjà inscrit ?' : 'Already registered?'} <Link to="/login" className="text-primary-light hover:text-white font-semibold">{fr ? 'Se connecter' : 'Log in'}</Link>
              </p>
            </>
          )}

          {phase === 'verify' && (
            <>
              <h2 className="font-display text-2xl font-bold text-white mb-1 text-center">{fr ? 'Vérifie ton email' : 'Verify your email'}</h2>
              <p className="text-muted text-sm mb-8 text-center">
                {fr ? 'Un code a été envoyé à' : 'A code was sent to'} <span className="text-slate-300">{formData.email}</span>
              </p>
              <form onSubmit={handleVerify} className="space-y-4">
                <input type="text" maxLength={6} placeholder="000000" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white/[0.03] border border-white/10 text-white text-center text-2xl tracking-[0.5em] px-4 py-4 rounded-lg outline-none focus:border-primary/50 transition-colors" />
                <button type="submit" disabled={code.length !== 6}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/5 disabled:text-muted text-white font-semibold py-3 rounded-lg text-sm transition-colors">
                  {fr ? 'Confirmer le code' : 'Confirm code'}
                </button>
              </form>
              <button disabled={cooldown > 0} className="w-full text-center text-sm mt-5 text-muted disabled:text-slate-700 hover:text-primary-light transition-colors">
                {cooldown > 0 ? (fr ? `Renvoyer le code (${cooldown}s)` : `Resend code (${cooldown}s)`) : (fr ? 'Renvoyer le code' : 'Resend code')}
              </button>
            </>
          )}

          {phase === 'done' && (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl mx-auto mb-5">✓</div>
              <h2 className="font-display text-white font-bold text-lg mb-2">{fr ? 'Compte activé' : 'Account activated'}</h2>
              <p className="text-muted text-sm mb-6">
                {fr ? 'Bienvenue sur Guardian Cyber Labs' : 'Welcome to Guardian Cyber Labs'}{formData.firstName ? `, ${formData.firstName}` : ''}.
              </p>
              <Link to="/dashboard" className="inline-block bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-shadow">
                {fr ? 'Accéder à mon espace' : 'Go to my dashboard'}
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
export default Register;