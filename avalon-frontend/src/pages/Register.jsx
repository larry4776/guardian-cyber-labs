import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { API_URL } from '../config';
import { countries } from '../data/countries';

const Register = () => {
  const [phase, setPhase] = useState('form');
  const [agreed, setAgreed] = useState(false);
  const [code, setCode] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingAuth, setPendingAuth] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const fr = language === 'fr';
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '', country: '', phone: '' });

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setPasswordError(''); };
  const handleNameChange = (e) => { const { name, value } = e.target; setFormData({ ...formData, [name]: value.replace(/[^a-zA-ZÀ-ÿ\s\-]/g, '') }); };
  const handlePhoneChange = (e) => { setFormData({ ...formData, phone: e.target.value.replace(/[^0-9+\s]/g, '') }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (formData.password !== formData.confirmPassword) {
      setPasswordError(fr ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password, first_name: formData.firstName, last_name: formData.lastName, country: formData.country, phone: formData.phone }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || (fr ? "Erreur lors de l'inscription." : 'Error during registration.'));
      }
      const data = await res.json();
      setPendingAuth({ token: data.access_token, user: data.user });
      startVerification();
    } catch (err) { setServerError(err.message); } finally { setLoading(false); }
  };

  const startVerification = () => {
    setPhase('verify'); setCooldown(60);
    const timer = setInterval(() => { setCooldown(c => { if (c <= 1) { clearInterval(timer); return 0; } return c - 1; }); }, 1000);
  };

  const handleVerify = (e) => { e.preventDefault(); if (pendingAuth) login(pendingAuth.token, pendingAuth.user); setPhase('done'); };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-white/5 items-center justify-center p-16">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 [mask-image:radial-gradient(ellipse_60%_60%_at_30%_50%,black_10%,transparent_100%)]"></div>
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-primary/20 blur-[130px] rounded-full"></div>
        <div className="relative max-w-md">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-light to-accent flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <Shield size={18} className="text-base" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">GUARDIAN <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">CYBER LABS</span></span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-4 leading-snug tracking-tight">
            {fr ? 'Construis des compétences qui comptent vraiment.' : 'Build skills that truly matter.'}
          </h1>
          <p className="text-muted text-sm leading-relaxed">
            {fr
              ? 'Red Team, Blue Team, GRC. Des parcours conçus comme de vrais audits, avec des scénarios que tu retrouveras sur le terrain.'
              : 'Red Team, Blue Team, GRC. Courses designed like real audits, with scenarios you\'ll encounter in the field.'}
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="flex lg:hidden items-center justify-center mb-8">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-light to-accent flex items-center justify-center">
              <Shield size={16} className="text-base" />
            </div>
          </div>

          {phase === 'form' && (
            <>
              <h2 className="font-display text-2xl font-bold text-white mb-1">{fr ? 'Créer un compte' : 'Create an account'}</h2>
              {serverError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4 mt-4">{serverError}</div>}

              <label className="flex items-start gap-3 bg-white/[0.02] border border-white/10 rounded-lg p-4 cursor-pointer mb-5 mt-6">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 accent-primary shrink-0" />
                <span className="text-xs text-slate-400 leading-relaxed">
                  {fr
                    ? <>J'accepte les <Link to="/conditions" className="text-primary-light hover:underline">conditions d'utilisation</Link> et je m'engage à n'utiliser les compétences acquises sur cette plateforme que dans un cadre légal et autorisé. Toute utilisation malveillante engage ma seule responsabilité.</>
                    : <>I accept the <Link to="/conditions" className="text-primary-light hover:underline">terms of use</Link> and commit to only using the skills acquired on this platform within a legal and authorized framework. Any malicious use is my sole responsibility.</>}
                </span>
              </label>

              <button type="button" onClick={() => agreed && setPhase('done')} disabled={!agreed}
                className="w-full bg-white hover:bg-slate-100 disabled:bg-white/5 disabled:text-muted disabled:cursor-not-allowed text-slate-900 font-semibold py-3 rounded-lg text-sm transition-colors mb-4">
                {fr ? 'Continuer avec Google' : 'Continue with Google'}
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-[11px] text-muted uppercase">{fr ? 'ou avec ton email' : 'or with your email'}</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              <fieldset disabled={!agreed} className={!agreed ? 'opacity-40' : ''}>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input name="firstName" type="text" placeholder={fr ? 'Prénom' : 'First name'} required value={formData.firstName} onChange={handleNameChange} className="bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />
                    <input name="lastName" type="text" placeholder={fr ? 'Nom' : 'Last name'} required value={formData.lastName} onChange={handleNameChange} className="bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />
                  </div>
                  <input name="email" type="email" placeholder="toi@exemple.com" required onChange={handleChange} className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />
                  <div className="relative">
                    <input name="password" type={showPassword ? 'text' : 'password'} placeholder={fr ? 'Mot de passe' : 'Password'} required onChange={handleChange} className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 pr-11 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-slate-300">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className={`h-full transition-all ${formData.password.length > 8 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.min(formData.password.length * 10, 100)}%` }}></div></div>
                  <div className="relative">
                    <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder={fr ? 'Confirmer le mot de passe' : 'Confirm password'} required onChange={handleChange} className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 pr-11 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-slate-300">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                  {passwordError && <p className="text-red-400 text-xs">{passwordError}</p>}
                  <div className="grid grid-cols-2 gap-3">
                    <select name="country" required onChange={handleChange} value={formData.country} className="bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors">
                      <option value="">{fr ? 'Pays' : 'Country'}</option>
                      {countries.map(c => <option key={c.name} value={c.name}>{c.name} ({c.code})</option>)}
                    </select>
                    <input name="phone" type="tel" placeholder={fr ? 'Téléphone' : 'Phone'} required value={formData.phone} onChange={handlePhoneChange} className="bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />
                  </div>
                  <button type="submit" disabled={!agreed} className="w-full bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:shadow-none text-white font-semibold py-3 rounded-lg text-sm transition-all mt-2">
                    {fr ? 'Créer mon compte' : 'Create my account'}
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
              <h2 className="font-display text-2xl font-bold text-white mb-1">{fr ? 'Vérifie ton email' : 'Verify your email'}</h2>
              <p className="text-muted text-sm mb-8">
                {fr ? 'Un code à 6 chiffres a été envoyé à' : 'A 6-digit code was sent to'} <span className="text-slate-300">{formData.email}</span>
              </p>
              <form onSubmit={handleVerify} className="space-y-4">
                <input type="text" maxLength={6} placeholder="000000" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white/[0.03] border border-white/10 text-white text-center text-2xl tracking-[0.5em] px-4 py-4 rounded-lg outline-none focus:border-primary/50 transition-colors" />
                <button type="submit" disabled={code.length !== 6} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/5 disabled:text-muted text-white font-semibold py-3 rounded-lg text-sm transition-colors">
                  {fr ? 'Confirmer le code' : 'Confirm code'}
                </button>
              </form>
              <button disabled={cooldown > 0} className="w-full text-center text-sm mt-5 text-muted disabled:text-slate-700 hover:text-primary-light transition-colors">
                {cooldown > 0 ? (fr ? `Renvoyer le code (${cooldown}s)` : `Resend code (${cooldown}s)`) : (fr ? 'Renvoyer le code' : 'Resend code')}
              </button>
            </>
          )}

          {phase === 'done' && (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl mx-auto mb-5">✓</div>
              <h2 className="font-display text-white font-bold text-lg mb-2">{fr ? 'Compte activé' : 'Account activated'}</h2>
              <p className="text-muted text-sm">
                {fr ? 'Bienvenue sur Guardian Cyber Labs' : 'Welcome to Guardian Cyber Labs'}{formData.firstName ? `, ${formData.firstName}` : ''}.
              </p>
              <Link to="/dashboard" className="inline-block mt-6 bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-shadow">
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