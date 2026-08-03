import React, { useState, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { API_URL } from '../config';

const TAGLINES = {
  fr: [
    { title: "Reprends là où tu t'es arrêté.", text: "Accède à tes parcours, suis ta progression, et continue à monter en compétence sur des scénarios réels de cyberdéfense." },
    { title: "Chaque connexion te rapproche du terrain.", text: "Retrouve tes modules, tes exercices et ta progression, exactement là où tu les as laissés." },
    { title: "La cybersécurité s'apprend en pratiquant.", text: "Reconnecte-toi pour continuer tes scénarios d'attaque et de défense, avec des cas concrets et réalistes." },
    { title: "Ton parcours t'attend.", text: "Reviens là où tu en étais, et poursuis ta montée en compétence en Red Team, Blue Team ou GRC." },
    { title: "Prêt pour la suite ?", text: "Tes parcours, ta progression et tes ressources t'attendent, à l'endroit exact où tu les as quittées." },
  ],
  en: [
    { title: "Pick up right where you left off.", text: "Access your courses, track your progress, and keep building skills through real cyberdefense scenarios." },
    { title: "Every login brings you closer to the field.", text: "Find your modules, exercises and progress exactly where you left them." },
    { title: "Cybersecurity is learned by practicing.", text: "Log back in to continue your attack and defense scenarios, with concrete, realistic cases." },
    { title: "Your course is waiting.", text: "Come back where you were, and keep leveling up in Red Team, Blue Team or GRC." },
    { title: "Ready for what's next?", text: "Your courses, progress and resources are waiting, right where you left them." },
  ],
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const fr = language === 'fr';

  const tagline = useMemo(() => {
    const list = TAGLINES[language];
    return list[Math.floor(Math.random() * list.length)];
  }, [language]);

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
          <h1 className="font-display text-3xl font-bold text-white mb-4 leading-snug tracking-tight">{tagline.title}</h1>
          <p className="text-muted text-sm leading-relaxed">{tagline.text}</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="flex lg:hidden items-center gap-2.5 justify-center mb-10">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-light to-accent flex items-center justify-center">
              <Shield size={16} className="text-base" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-white">GUARDIAN <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">CYBER LABS</span></span>
          </div>

          <h2 className="font-display text-2xl font-bold text-white mb-1">{fr ? 'Connexion' : 'Log in'}</h2>
          <p className="text-muted text-sm mb-8">{fr ? 'Content de te revoir.' : 'Good to see you again.'}</p>

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Email</label>
              <input type="email" placeholder="toi@exemple.com" required onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">{fr ? 'Mot de passe' : 'Password'}</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" required onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 pr-11 rounded-lg text-sm outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-slate-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-primary-light hover:text-white">{fr ? 'Mot de passe oublié ?' : 'Forgot password?'}</Link>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:shadow-none text-white font-semibold py-3 rounded-lg text-sm transition-all mt-2">
              {loading ? (fr ? 'Connexion...' : 'Logging in...') : (fr ? 'Se connecter' : 'Log in')}
            </button>
          </form>

          <p className="text-center text-muted text-sm mt-8">
            {fr ? 'Pas encore de compte ?' : "Don't have an account?"} <Link to="/register" className="text-primary-light hover:text-white font-semibold">{fr ? "S'inscrire" : 'Sign up'}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;