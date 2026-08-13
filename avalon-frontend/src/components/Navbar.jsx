import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Languages, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const fr = language === 'fr';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`relative flex justify-between items-center px-4 md:px-6 py-3 backdrop-blur-xl border-b sticky top-0 z-50 transition-colors duration-300 ${
      scrolled ? 'bg-base/90 border-primary/20' : 'bg-base/70 border-white/5'
    }`}>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group relative z-10 shrink-0">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500 rounded-full"></div>
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-primary-light to-accent flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-shadow">
            <Shield size={16} className="text-white" />
          </div>
        </div>
        <span className="font-display text-sm font-bold tracking-tight text-white hidden lg:block">
          GUARDIAN <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">CYBER LABS</span>
        </span>
        <span className="font-display text-sm font-bold tracking-tight text-white lg:hidden">
          <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">GCL</span>
        </span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex gap-1 items-center relative z-10">
        <Link to="/catalog" className="text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-2 rounded-lg hover:bg-white/5 transition-colors whitespace-nowrap">
          {fr ? 'Catalogue' : 'Catalog'}
        </Link>
        <Link to="/certificates" className="text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-2 rounded-lg hover:bg-white/5 transition-colors whitespace-nowrap">
          {fr ? 'Certifiés' : 'Certified'}
        </Link>
        <Link to="/contact" className="text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-2 rounded-lg hover:bg-white/5 transition-colors whitespace-nowrap">
          Contact
        </Link>
        <Link to="/about" className="text-xs font-semibold text-primary-light border border-primary/20 bg-primary/[0.04] hover:bg-primary/10 hover:border-primary/50 px-2.5 py-2 rounded-lg transition-all duration-300 flex items-center gap-1 whitespace-nowrap">
          <Shield size={12} />
          {fr ? "L'Académie" : 'Academy'}
        </Link>

        <button onClick={toggleLanguage} className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white border border-white/10 hover:border-primary/40 bg-white/[0.02] px-2.5 py-2 rounded-lg transition-colors">
          <Languages size={12} />
          {language === 'fr' ? 'FR' : 'EN'}
        </button>

        {!isAuthenticated ? (
          <Link to="/login" className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-shadow duration-300 whitespace-nowrap">
            {fr ? 'Connexion' : 'Log in'}
          </Link>
        ) : (
          <>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-xs font-semibold text-primary-light hover:text-white px-2.5 py-2 rounded-lg hover:bg-primary/10 transition-colors whitespace-nowrap">
                Admin
              </Link>
            )}
            <Link to="/dashboard" className="text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-2 rounded-lg hover:bg-white/5 transition-colors whitespace-nowrap">
              {fr ? 'Apprentissage' : 'Learning'}
            </Link>
            <Link to="/profile" className="text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-2 rounded-lg hover:bg-white/5 transition-colors whitespace-nowrap">
              {fr ? 'Profil' : 'Profile'}
            </Link>
            <button onClick={logout} className="text-xs font-semibold text-red-400 hover:text-red-300 px-2.5 py-2 rounded-lg hover:bg-red-500/10 transition-colors whitespace-nowrap">
              {fr ? 'Déconnexion' : 'Log out'}
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-light to-accent flex items-center justify-center text-xs font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </>
        )}
      </div>

      {/* Mobile burger */}
      <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white relative z-10">
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-base/95 backdrop-blur-xl border-b border-white/10 md:hidden flex flex-col p-4 gap-2 z-20">
          <Link to="/catalog" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-slate-300 px-3 py-2 rounded-lg hover:bg-white/5">
            {fr ? 'Catalogue' : 'Catalog'}
          </Link>
          <Link to="/certificates" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-slate-300 px-3 py-2 rounded-lg hover:bg-white/5">
            {fr ? 'Certifiés' : 'Certified'}
          </Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-slate-300 px-3 py-2 rounded-lg hover:bg-white/5">
            Contact
          </Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-primary-light px-3 py-2 rounded-lg hover:bg-white/5">
            {fr ? "L'Académie" : 'Academy'}
          </Link>
          <button onClick={toggleLanguage} className="text-left text-sm font-semibold text-slate-300 px-3 py-2 rounded-lg hover:bg-white/5">
            {fr ? 'Passer en English' : 'Passer en Français'}
          </button>
          {!isAuthenticated ? (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark px-3 py-2 rounded-lg text-center">
              {fr ? 'Connexion' : 'Log in'}
            </Link>
          ) : (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-primary-light px-3 py-2 rounded-lg hover:bg-white/5">Admin</Link>
              )}
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-slate-300 px-3 py-2 rounded-lg hover:bg-white/5">
                {fr ? 'Mon Apprentissage' : 'My Learning'}
              </Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-slate-300 px-3 py-2 rounded-lg hover:bg-white/5">
                {fr ? 'Mon Profil' : 'My Profile'}
              </Link>
              <button onClick={logout} className="text-left text-sm font-semibold text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/10">
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