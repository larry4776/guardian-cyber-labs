import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LanguageContext } from '../context/LanguageContext';

const PALETTE = {
  red: { main: '#a94442', text: '#c0505a', bg: 'rgba(169,68,66,0.08)', border: 'rgba(169,68,66,0.35)', cardBg: 'rgba(169,68,66,0.05)' },
  blue: { main: '#3b6ea5', text: '#4a7fc2', bg: 'rgba(59,110,165,0.08)', border: 'rgba(59,110,165,0.35)', cardBg: 'rgba(59,110,165,0.05)' },
  gold: { main: '#b8974a', text: '#c9a94e', bg: 'rgba(184,151,74,0.08)', border: 'rgba(184,151,74,0.35)', cardBg: 'rgba(184,151,74,0.05)' },
};

const ADVANTAGES = [
  { icon: '⚡', title: 'Compétences opérationnelles', desc: 'Chaque module produit une compétence directement utilisable en entreprise, pas un savoir théorique.' },
  { icon: '🌍', title: 'Accessible partout', desc: "Plateforme cloud, accessible depuis n'importe quel navigateur, 24h/24, 7j/7." },
  { icon: '📋', title: 'Certification reconnue', desc: 'Badges et attestations de compétences vérifiables par les recruteurs.' },
  { icon: '🤝', title: 'Communauté active', desc: 'Discord et WhatsApp animés par des professionnels en activité.' },
  { icon: '💬', title: 'Support humain', desc: 'Un formateur référent répond à vos questions dans les 24h.' },
  { icon: '🎯', title: 'Progression guidée', desc: 'Test de positionnement gratuit pour démarrer exactement au bon niveau.' },
];

const COMPARISONS = [
  { left: 'Capture de flag automatique', right: 'Livrables réels corrigés par des humains', label: 'Correction humaine' },
  { left: 'Orienté offensif uniquement', right: 'Red Team + Blue Team + GRC dès le départ', label: 'Couverture complète' },
  { left: 'Prérequis réseau/dev imposés', right: 'Aucun prérequis — vous partez de zéro', label: 'Zéro barrière' },
  { left: 'Parcours figés sans feedback', right: 'Suivi personnalisé par formateurs référents', label: 'Accompagnement réel' },
];

const About = () => {
  const { language } = useContext(LanguageContext);
  const fr = language === 'fr';

  return (
    <div className="min-h-screen text-white font-sans bg-base">
      <Navbar />

      {/* INTRO */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <p className="font-mono text-xs text-primary tracking-widest mb-4">[ À PROPOS ]</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {fr ? "Qu'est-ce que GUARDIAN CYBER LABS ?" : 'What is GUARDIAN CYBER LABS?'}
        </h1>
        <p className="text-muted text-base leading-relaxed max-w-2xl">
          {fr
            ? "GUARDIAN CYBER LABS est une plateforme internationale de formation pratique en cybersécurité. Notre mission : rendre les compétences offensives, défensives et de gouvernance accessibles à toute personne motivée, sans prérequis imposé, avec un accompagnement humain à chaque étape."
            : "GUARDIAN CYBER LABS is an international practical cybersecurity training platform. Our mission: making offensive, defensive and governance skills accessible to every motivated person, with no imposed prerequisites and human support at every step."}
        </p>
      </section>

      {/* ARCHITECTURE */}
      <section className="border-t border-white/5 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-mono text-xs text-primary tracking-widest">[ ARCHITECTURE ]</p>
          </div>

          {/* Schéma d'architecture strict : liaisons uniquement entre Red Team <-> Blue Team <-> GRC, et Blue Team -> L'apprenant en bas */}
          <div className="max-w-4xl mx-auto">
            
            {/* Ligne horizontale principale contenant les 3 blocs et les connecteurs directs entre eux */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
              
              {/* 1. Red Team */}
              <div className="rounded-xl p-6 text-center"
                style={{ background: PALETTE.red.cardBg, border: `1px solid ${PALETTE.red.border}` }}>
                <p className="font-display text-base font-bold mb-4" style={{ color: PALETTE.red.text }}>Red Team</p>
                <div className="flex flex-col items-center gap-2">
                  {['[ Kali ]', '[ Exploit ]', '[ OSINT ]'].map(tag => (
                    <span key={tag} className="font-mono text-xs px-3 py-1 rounded"
                      style={{ color: PALETTE.red.text, border: `1px solid ${PALETTE.red.border}`, background: PALETTE.red.bg }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connecteur horizontal 1 : Red Team -> Blue Team */}
              <div className="hidden md:flex items-center justify-center px-2">
                <div className="w-8 h-[1.5px] bg-[rgba(59,109,240,0.5)] relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#3b6df0]"></div>
                </div>
              </div>

              {/* 2. Blue Team (Brutim) */}
              <div className="rounded-xl p-6 text-center relative"
                style={{ background: PALETTE.blue.cardBg, border: `1px solid ${PALETTE.blue.border}` }}>
                <p className="font-display text-base font-bold mb-4" style={{ color: PALETTE.blue.text }}>Blue Team</p>
                <div className="flex flex-col items-center gap-2">
                  {['[ SIEM ]', '[ SOC ]', '[ Forensic ]'].map(tag => (
                    <span key={tag} className="font-mono text-xs px-3 py-1 rounded"
                      style={{ color: PALETTE.blue.text, border: `1px solid ${PALETTE.blue.border}`, background: PALETTE.blue.bg }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connecteur horizontal 2 : Blue Team -> GRC */}
              <div className="hidden md:flex items-center justify-center px-2">
                <div className="w-8 h-[1.5px] bg-[rgba(59,109,240,0.5)] relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#3b6df0]"></div>
                </div>
              </div>

              {/* 3. GRC */}
              <div className="rounded-xl p-6 text-center"
                style={{ background: PALETTE.gold.cardBg, border: `1px solid ${PALETTE.gold.border}` }}>
                <p className="font-display text-base font-bold mb-4" style={{ color: PALETTE.gold.text }}>GRC</p>
                <div className="flex flex-col items-center gap-2">
                  {['[ ISO27001 ]', '[ RGPD ]', '[ Audit ]'].map(tag => (
                    <span key={tag} className="font-mono text-xs px-3 py-1 rounded"
                      style={{ color: PALETTE.gold.text, border: `1px solid ${PALETTE.gold.border}`, background: PALETTE.gold.bg }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Connecteur vertical unique partant du bas de Blue Team vers L'apprenant */}
            <div className="flex flex-col items-center">
              <div className="w-[1.5px] h-8 bg-[rgba(59,109,240,0.5)] relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#3b6df0]"></div>
              </div>

              {/* Boîte L'apprenant */}
              <div className="rounded-xl px-8 py-4 text-center mt-1"
                style={{ background: 'rgba(59,109,240,0.08)', border: '1px solid rgba(59,109,240,0.3)' }}>
                <p className="font-mono text-sm font-semibold text-primary flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                  {fr ? "L'apprenant" : 'The learner'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DIFFÉRENCIATEURS */}
      <section className="border-t border-white/5 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-mono text-xs text-primary tracking-widest mb-3">[ DIFFÉRENCIATEURS ]</p>
          <h2 className="font-display text-3xl font-bold mb-10">
            {fr ? "Pourquoi nous plutôt qu'une autre plateforme ?" : 'Why us over another platform?'}
          </h2>

          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="grid grid-cols-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="px-6 py-4 border-r" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <span className="font-mono text-[10px] font-semibold tracking-widest px-2.5 py-1 rounded"
                  style={{ color: '#c0505a', border: '1px solid rgba(169,68,66,0.4)', background: 'rgba(169,68,66,0.08)' }}>
                  [ CONCURRENCE ]
                </span>
              </div>
              <div className="px-6 py-4">
                <span className="font-mono text-[10px] font-semibold tracking-widest px-2.5 py-1 rounded"
                  style={{ color: '#6a9e6a', border: '1px solid rgba(106,158,106,0.4)', background: 'rgba(106,158,106,0.08)' }}>
                  [ GUARDIAN CYBER LABS ]
                </span>
              </div>
            </div>

            {COMPARISONS.map((row, i) => (
              <div key={i} className="grid grid-cols-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="px-6 py-5 border-r flex flex-col gap-1.5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <span className="font-mono text-[9px] tracking-widest" style={{ color: '#c0505a', opacity: 0.7 }}>
                    [{row.label}]
                  </span>
                  <p className="text-muted text-sm">{row.left}</p>
                </div>
                <div className="px-6 py-5 flex items-center gap-3">
                  <span className="text-sm shrink-0" style={{ color: '#6a9e6a' }}>✓</span>
                  <p className="text-slate-300 text-sm">{row.right}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="border-t border-white/5 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-mono text-xs text-primary tracking-widest mb-3">[ AVANTAGES ]</p>
          <h2 className="font-display text-3xl font-bold mb-10">
            {fr ? 'Ce que vous gagnez concrètement' : 'What you gain concretely'}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {ADVANTAGES.slice(0, 4).map((a, i) => (
              <div key={i} className="rounded-xl p-5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="text-2xl mb-3 block">{a.icon}</span>
                <p className="font-display text-sm font-bold text-white mb-2">{a.title}</p>
                <p className="text-muted text-xs leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {ADVANTAGES.slice(4).map((a, i) => (
              <div key={i} className="rounded-xl p-5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="text-2xl mb-3 block">{a.icon}</span>
                <p className="font-display text-sm font-bold text-white mb-2">{a.title}</p>
                <p className="text-muted text-xs leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNAUTÉ */}
      <section className="border-t border-white/5 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-mono text-xs text-primary tracking-widest mb-3">[ COMMUNITY ]</p>
          <h2 className="font-display text-3xl font-bold mb-4">
            {fr ? 'Rejoins la communauté' : 'Join the community'}
          </h2>
          <p className="text-muted text-base max-w-md mx-auto mb-8">
            {fr
              ? "Des milliers d'apprenants et de professionnels échangent chaque jour sur nos canaux."
              : 'Thousands of learners and professionals exchange every day on our channels.'}
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
            <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-lg text-sm"
              style={{ backgroundColor: '#4a5394', border: '1px solid rgba(88,101,242,0.3)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.113 18.102.128 18.115a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
              Discord
            </a>
            <a href="https://whatsapp.com/channel/0029Va8oNXf3WHTQ8MIJzS2T" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-lg text-sm"
              style={{ backgroundColor: '#1a7a45', border: '1px solid rgba(37,211,102,0.3)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>

          {/* CTA final */}
          <div className="rounded-2xl px-8 py-10"
            style={{ background: 'rgba(59,109,240,0.06)', border: '1px solid rgba(59,109,240,0.2)' }}>
            <h3 className="font-display text-2xl font-bold mb-6">
              {fr ? 'Prêt à commencer ?' : 'Ready to start?'}
            </h3>
            <Link to="/catalog"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-7 py-3.5 rounded-lg transition-all text-sm">
              {fr ? 'Explorer le catalogue' : 'Explore catalog'} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default About;