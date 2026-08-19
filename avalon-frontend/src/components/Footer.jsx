import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';

const Footer = () => {
  const { language } = useContext(LanguageContext);
  const fr = language === 'fr';

  return (
    <footer style={{ backgroundColor: '#080c14', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-6xl mx-auto px-6 py-14">

        {/* Grille 5 colonnes */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">

          {/* Colonne 1 — Logo */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
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
            <p className="text-muted text-xs leading-relaxed max-w-[160px]">
              {fr
                ? 'Plateforme internationale de formation en cybersécurité.'
                : 'International cybersecurity training platform.'}
            </p>
          </div>

          {/* Colonne 2 — Navigation */}
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[0.15em] text-muted uppercase mb-4">
              {fr ? 'Navigation' : 'Navigation'}
            </p>
            <div className="flex flex-col gap-2.5">
              <Link to="/" className="text-slate-400 hover:text-white text-xs transition-colors">{fr ? 'Accueil' : 'Home'}</Link>
              <Link to="/catalog" className="text-slate-400 hover:text-white text-xs transition-colors">{fr ? 'Catalogue' : 'Catalog'}</Link>
              <Link to="/about" className="text-slate-400 hover:text-white text-xs transition-colors">{fr ? 'À propos' : 'About'}</Link>
            </div>
          </div>

          {/* Colonne 3 — Formations */}
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[0.15em] text-muted uppercase mb-4">
              {fr ? 'Formations' : 'Courses'}
            </p>
            <div className="flex flex-col gap-2.5">
              <Link to="/catalog" className="text-xs transition-colors hover:opacity-80" style={{ color: '#c0505a' }}>Red Team</Link>
              <Link to="/catalog" className="text-xs transition-colors hover:opacity-80" style={{ color: '#4a7fc2' }}>Blue Team</Link>
              <Link to="/catalog" className="text-xs transition-colors hover:opacity-80" style={{ color: '#c9a94e' }}>GRC</Link>
              <Link to="/catalog" className="text-slate-400 hover:text-white text-xs transition-colors">
                {fr ? 'Test de positionnement' : 'Placement test'}
              </Link>
            </div>
          </div>

          {/* Colonne 4 — Ressources */}
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[0.15em] text-muted uppercase mb-4">
              {fr ? 'Ressources' : 'Resources'}
            </p>
            <div className="flex flex-col gap-2.5">
              <Link to="/contact" className="text-slate-400 hover:text-white text-xs transition-colors">Contact</Link>
              <Link to="/conditions" className="text-slate-400 hover:text-white text-xs transition-colors">
                {fr ? 'Confidentialité' : 'Privacy'}
              </Link>
            </div>
          </div>

          {/* Colonne 5 — Communauté */}
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-[0.15em] text-muted uppercase mb-4">
              {fr ? 'Communauté' : 'Community'}
            </p>
            <div className="flex flex-col gap-2.5">
              <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-white text-xs transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.113 18.102.128 18.115a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
                Discord
              </a>
              <a href="https://whatsapp.com/channel/0029Va8oNXf3WHTQ8MIJzS2T" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-white text-xs transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

        </div>

        {/* Ligne paiements */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
            {fr ? 'Paiement :' : 'Payment:'}
          </span>
          {['Visa', 'Mastercard', 'PayPal', 'MTN', 'Wave'].map(p => (
            <span key={p} className="font-mono text-[10px] text-slate-400 px-2.5 py-1 rounded"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {p}
            </span>
          ))}
        </div>

        {/* Séparateur + copyright */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="pt-6">
          <p className="font-mono text-[10px] text-muted">
            © 2026 GUARDIAN CYBER LABS — {fr ? 'Tous droits réservés' : 'All rights reserved'}
          </p>
        </div>

      </div>
    </footer>
  );
};
export default Footer;