import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';

const Footer = () => {
  const { language } = useContext(LanguageContext);
  const fr = language === 'fr';

  return (
    <footer className="relative border-t border-white/5 mt-20">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <span className="font-display text-lg font-bold tracking-tight text-white block mb-4">
            GUARDIAN <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">CYBER LABS</span>
          </span>
          <p className="text-muted text-sm leading-relaxed">
            {fr
              ? "Branche formation d'AVALON SECURE — cyberdéfense, réseau et hacking offensif, pensée pour un public international."
              : 'Training branch of AVALON SECURE — cyberdefense, networking and offensive hacking, designed for an international audience.'}
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Navigation</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/catalog" className="text-muted hover:text-primary-light transition-colors">{fr ? 'Catalogue' : 'Catalog'}</Link>
            <Link to="/about" className="text-muted hover:text-primary-light transition-colors">{fr ? "L'Académie" : 'Academy'}</Link>
            <Link to="/certificates" className="text-muted hover:text-primary-light transition-colors">{fr ? 'Nos certifiés' : 'Our certified'}</Link>
            <Link to="/contact" className="text-muted hover:text-primary-light transition-colors">Contact</Link>
            <Link to="/conditions" className="text-muted hover:text-primary-light transition-colors">{fr ? "Conditions d'utilisation" : 'Terms of use'}</Link>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Contact</h4>
          <p className="text-muted text-sm font-mono">avalonsecure7@gmail.com</p>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 text-center">
        <p className="text-slate-600 text-xs">
          © {new Date().getFullYear()} GUARDIAN CYBER LABS — {fr ? 'porté par AVALON SECURE. Tous droits réservés.' : 'powered by AVALON SECURE. All rights reserved.'}
        </p>
      </div>
    </footer>
  );
};
export default Footer;