import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Languages, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const fr = language === 'fr';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`relative flex justify-between items-center px-4 md:px-8 py-4 backdrop-blur-xl border-b sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-base/95 border-white/10' : 'bg-base/70 border-white/5'
    }`}>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

      {/* Gauche — Logo + Nav */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" stroke="#3b6df0" strokeWidth="1.5" fill="rgba(59,109,240,0.08)" />
            <polygon points="16,8 24,12 24,20 16,24 8,20 8,12" stroke="#3b6df0" strokeWidth="1" fill="none" />
            <circle cx="16" cy="16" r="2.5" fill="#3b6df0" />
          </svg>
          <span className="font-display font-bold text-white whitespace-nowrap"
            style={{ fontSize: '10px', letterSpacing: '0.12em' }}>
            GUARDIAN <span style={{ color: '#3b6df0' }}>CYBER LABS</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link to="/" className={`font-mono text-xs font-medium px-3 py-2 rounded-lg transition-all whitespace-nowrap ${isActive('/') ? 'text-white bg-white/8 border border-white/10' : 'text-muted hover:text-white hover:bg-white/5'}`}>
            {fr ? 'Accueil' : 'Home'}
          </Link>
          <Link to="/catalog" className={`font-mono text-xs font-medium px-3 py-2 rounded-lg transition-all whitespace-nowrap ${isActive('/catalog') ? 'text-white bg-white/8 border border-white/10' : 'text-muted hover:text-white hover:bg-white/5'}`}>
            {fr ? 'Catalogue' : 'Catalog'}
          </Link>
          <Link to="/about" className={`font-mono text-xs font-medium px-3 py-2 rounded-lg transition-all whitespace-nowrap ${isActive('/about') ? 'text-white bg-white/8 border border-white/10' : 'text-muted hover:text-white hover:bg-white/5'}`}>
            {fr ? 'À propos' : 'About'}
          </Link>
        </div>
      </div>

      {/* Droite */}
      <div className="hidden md:flex items-center gap-2">
        <button onClick={toggleLanguage}
          className="flex items-center gap-1.5 font-mono text-xs font-semibold text-muted hover:text-white border border-white/10 hover:border-primary/40 px-3 py-2 rounded-lg transition-all">
          <Languages size={12} />
          {language === 'fr' ? 'FR' : 'EN'}
        </button>

        {!isAuthenticated ? (
          <>
            <Link to="/login"
              className="font-mono text-xs font-semibold text-white border border-white/15 hover:border-primary/50 hover:text-primary px-4 py-2 rounded-lg transition-all whitespace-nowrap">
              {fr ? 'Connexion' : 'Log in'}
            </Link>
            <Link to="/register"
              className="font-mono text-xs font-bold text-white px-4 py-2 rounded-lg transition-all whitespace-nowrap"
              style={{ backgroundColor: '#3b6ea5', border: '1px solid rgba(59,110,165,0.4)' }}>
              {fr ? 'Commencer' : 'Get started'}
            </Link>
          </>
        ) : (
          <>
            {user?.role === 'admin' && (
              <Link to="/admin" className="font-mono text-xs font-semibold text-primary-light hover:text-white px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors whitespace-nowrap">
                Admin
              </Link>
            )}
            <Link to="/dashboard" className="font-mono text-xs font-semibold text-muted hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors whitespace-nowrap">
              {fr ? 'Apprentissage' : 'Learning'}
            </Link>
            <Link to="/profile" className="font-mono text-xs font-semibold text-muted hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors whitespace-nowrap">
              {fr ? 'Profil' : 'Profile'}
            </Link>
            <button onClick={logout} className="font-mono text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors whitespace-nowrap">
              {fr ? 'Déconnexion' : 'Log out'}
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </>
        )}
      </div>

      {/* Mobile burger */}
      <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white">
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-base/98 backdrop-blur-xl border-b border-white/10 md:hidden flex flex-col p-4 gap-1 z-20">
          <Link to="/" onClick={() => setMobileOpen(false)} className="font-mono text-sm text-muted px-3 py-3 rounded-lg hover:bg-white/5 hover:text-white">
            {fr ? 'Accueil' : 'Home'}
          </Link>
          <Link to="/catalog" onClick={() => setMobileOpen(false)} className="font-mono text-sm text-muted px-3 py-3 rounded-lg hover:bg-white/5 hover:text-white">
            {fr ? 'Catalogue' : 'Catalog'}
          </Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="font-mono text-sm text-muted px-3 py-3 rounded-lg hover:bg-white/5 hover:text-white">
            {fr ? 'À propos' : 'About'}
          </Link>
          <div className="border-t border-white/10 my-2"></div>
          <button onClick={toggleLanguage} className="text-left font-mono text-sm text-muted px-3 py-3 rounded-lg hover:bg-white/5 hover:text-white">
            {fr ? 'Passer en English' : 'Passer en Français'}
          </button>
          {!isAuthenticated ? (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="font-mono text-sm text-white border border-white/15 px-3 py-3 rounded-lg text-center">
                {fr ? 'Connexion' : 'Log in'}
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}
                className="font-mono text-sm font-bold text-white px-3 py-3 rounded-lg text-center"
                style={{ backgroundColor: '#3b6ea5' }}>
                {fr ? 'Commencer' : 'Get started'}
              </Link>
            </>
          ) : (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="font-mono text-sm text-primary-light px-3 py-3 rounded-lg hover:bg-white/5">Admin</Link>
              )}
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="font-mono text-sm text-muted px-3 py-3 rounded-lg hover:bg-white/5 hover:text-white">
                {fr ? 'Mon Apprentissage' : 'My Learning'}
              </Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="font-mono text-sm text-muted px-3 py-3 rounded-lg hover:bg-white/5 hover:text-white">
                {fr ? 'Mon Profil' : 'My Profile'}
              </Link>
              <button onClick={logout} className="text-left font-mono text-sm text-red-400 px-3 py-3 rounded-lg hover:bg-red-500/10">
                {fr ? 'Déconnexion' : 'Log out'}
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
export default Navbar;