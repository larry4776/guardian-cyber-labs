import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Languages, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`relative flex justify-between items-center px-6 md:px-8 py-4 backdrop-blur-xl border-b sticky top-0 z-50 transition-colors duration-300 ${
      scrolled ? 'bg-base/90 border-primary/20' : 'bg-base/70 border-white/5'
    }`}>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>

      <Link to="/" className="flex items-center gap-3 group relative z-10">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500 rounded-full"></div>
          <div className="relative w-4 h-4 rounded-[3px] bg-gradient-to-br from-primary-light via-accent to-primary rotate-45 group-hover:rotate-[225deg] transition-transform duration-700 ease-out shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
        </div>
        <span className="font-display text-lg font-bold tracking-tight text-white">
          GUARDIAN <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">CYBER LABS</span>
        </span>
      </Link>

      <div className="hidden md:flex gap-3 items-center relative z-10">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white border border-white/10 hover:border-primary/40 bg-white/[0.02] px-3 py-2 rounded-lg transition-colors"
        >
          <Languages size={14} />
          {language === 'fr' ? 'FR' : 'EN'}
        </button>

        <Link to="/about" className="flex items-center gap-2 text-sm font-semibold text-primary-light border border-primary/20 bg-primary/[0.04] hover:bg-primary/10 hover:border-primary/50 px-4 py-2 rounded-lg transition-all duration-300">
          <GraduationCap size={16} />
          {language === 'fr' ? "L'Académie" : 'Academy'}
        </Link>

        {!isAuthenticated ? (
          <Link
            to="/login"
            className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-shadow duration-300"
          >
            {language === 'fr' ? 'Connexion' : 'Log in'}
          </Link>
        ) : (
          <>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-sm font-semibold text-primary-light hover:text-white px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors">
                Console Admin
              </Link>
            )}
            <Link to="/dashboard" className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
              {language === 'fr' ? 'Mon Apprentissage' : 'My Learning'}
            </Link>
            <Link to="/profile" className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
              {language === 'fr' ? 'Mon Profil' : 'My Profile'}
            </Link>
            <button onClick={logout} className="text-sm font-semibold text-red-400 hover:text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors">
              {language === 'fr' ? 'Déconnexion' : 'Log out'}
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-surfaceLight to-surface border border-white/10 flex items-center justify-center text-xs font-bold text-white">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </>
        )}
      </div>

      <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white relative z-10">
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-base/95 backdrop-blur-xl border-b border-white/10 md:hidden flex flex-col p-4 gap-2 z-20">
          <button onClick={toggleLanguage} className="text-left text-sm font-semibold text-slate-300 px-3 py-2 rounded-lg hover:bg-white/5">
            {language === 'fr' ? 'Passer en English' : 'Passer en Français'}
          </button>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-primary-light px-3 py-2 rounded-lg hover:bg-white/5">
            {language === 'fr' ? "L'Académie" : 'Academy'}
          </Link>
          {!isAuthenticated ? (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-white bg-primary px-3 py-2 rounded-lg text-center">
              {language === 'fr' ? 'Connexion' : 'Log in'}
            </Link>
          ) : (
            <>
              {user?.role === 'admin' && <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-primary-light px-3 py-2 rounded-lg hover:bg-white/5">Console Admin</Link>}
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-slate-300 px-3 py-2 rounded-lg hover:bg-white/5">{language === 'fr' ? 'Mon Apprentissage' : 'My Learning'}</Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-slate-300 px-3 py-2 rounded-lg hover:bg-white/5">{language === 'fr' ? 'Mon Profil' : 'My Profile'}</Link>
              <button onClick={logout} className="text-left text-sm font-semibold text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/10">{language === 'fr' ? 'Déconnexion' : 'Log out'}</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
export default Navbar;