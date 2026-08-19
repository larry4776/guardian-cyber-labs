import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LanguageContext } from '../context/LanguageContext';

const SECTIONS = [
  { id: 'responsable', label: 'Responsable du traitement', label_en: 'Data Controller' },
  { id: 'donnees', label: 'Données collectées', label_en: 'Data Collected' },
  { id: 'finalites', label: 'Finalités du traitement', label_en: 'Processing Purposes' },
  { id: 'base', label: 'Base légale', label_en: 'Legal Basis' },
  { id: 'duree', label: 'Durée de conservation', label_en: 'Retention Period' },
  { id: 'droits', label: 'Vos droits', label_en: 'Your Rights' },
  { id: 'cookies', label: 'Cookies', label_en: 'Cookies' },
];

const Card = ({ children }) => (
  <div className="rounded-2xl p-6" style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.08)' }}>
    {children}
  </div>
);

const BulletList = ({ items, fr }) => (
  <ul className="space-y-2">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#94A3B8' }}>
        <span style={{ color: '#4a7fc2', flexShrink: 0, marginTop: '1px' }}>•</span>
        {fr ? item.fr : item.en}
      </li>
    ))}
  </ul>
);

const SectionTitle = ({ children }) => (
  <h2 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
    <span style={{ color: '#4a7fc2' }}>#</span>
    {children}
  </h2>
);

const Conditions = () => {
  const { language } = useContext(LanguageContext);
  const fr = language === 'fr';
  const [activeSection, setActiveSection] = useState('responsable');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen text-white font-sans bg-base">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* En-tête */}
        <p className="font-mono text-xs text-primary tracking-widest mb-3">[ LEGAL ]</p>
        <h1 className="font-display text-4xl font-bold mb-2">
          {fr ? 'Politique de confidentialité' : 'Privacy Policy'}
        </h1>
        <p className="font-mono text-xs text-muted mb-16">
          {fr ? 'Dernière mise à jour : janvier 2026' : 'Last updated: January 2026'}
        </p>

        <div className="grid lg:grid-cols-[240px_1fr] gap-10 items-start">

          {/* Sommaire sticky — dans une carte */}
          <div className="hidden lg:block lg:sticky lg:top-24">
            <div className="rounded-2xl p-4" style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3 px-2">
                {fr ? 'Sommaire' : 'Contents'}
              </p>
              <nav className="space-y-1">
                {SECTIONS.map(({ id, label, label_en }) => {
                  const isActive = activeSection === id;
                  return (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all"
                      style={{
                        color: isActive ? '#ffffff' : '#8A93A6',
                        background: isActive ? 'rgba(59,110,165,0.2)' : 'transparent',
                        border: isActive ? '1px solid rgba(59,110,165,0.45)' : '1px solid transparent',
                        fontFamily: 'inherit',
                      }}>
                      {fr ? label : label_en}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Contenu — chaque section dans sa propre carte */}
          <div className="space-y-6">

            {/* 1. Responsable */}
            <Card>
              <section id="responsable">
                <SectionTitle>{fr ? 'Responsable du traitement' : 'Data Controller'}</SectionTitle>
                <p className="text-muted text-sm leading-relaxed mb-4">
                  {fr
                    ? "GUARDIAN CYBER LABS est responsable du traitement de vos données personnelles dans le cadre de l'utilisation de la plateforme."
                    : 'GUARDIAN CYBER LABS is responsible for processing your personal data in the context of using the platform.'}
                </p>
                <p className="text-muted text-sm">
                  {fr ? 'Contact DPO :' : 'DPO contact:'}{' '}
                  <a href="mailto:privacy@guardiancyberlabs.io" style={{ color: '#4a7fc2' }}>
                    privacy@guardiancyberlabs.io
                  </a>
                </p>
              </section>
            </Card>

            {/* 2. Données collectées */}
            <Card>
              <section id="donnees">
                <SectionTitle>{fr ? 'Données collectées' : 'Data Collected'}</SectionTitle>
                <BulletList fr={fr} items={[
                  { fr: 'Identité : nom, prénom, adresse email', en: 'Identity: name, first name, email address' },
                  { fr: 'Données de connexion : identifiants, mots de passe hashés', en: 'Login data: credentials, hashed passwords' },
                  { fr: 'Données de progression : modules complétés, livrables soumis, notes', en: 'Progress data: completed modules, submitted deliverables, grades' },
                  { fr: 'Données de paiement : traitées exclusivement par nos prestataires de paiement certifiés PCI-DSS', en: 'Payment data: processed exclusively by our PCI-DSS certified payment providers' },
                ]} />
              </section>
            </Card>

            {/* 3. Finalités */}
            <Card>
              <section id="finalites">
                <SectionTitle>{fr ? 'Finalités du traitement' : 'Processing Purposes'}</SectionTitle>
                <p className="text-muted text-sm mb-4">
                  {fr ? 'Vos données sont utilisées pour :' : 'Your data is used for:'}
                </p>
                <BulletList fr={fr} items={[
                  { fr: 'La création et la gestion de votre compte apprenant', en: 'Creating and managing your learner account' },
                  { fr: "L'accès aux formations achetées", en: 'Access to purchased courses' },
                  { fr: 'Le suivi de votre progression pédagogique', en: 'Tracking your learning progress' },
                  { fr: 'La communication avec votre formateur référent', en: 'Communication with your lead instructor' },
                  { fr: "L'envoi de communications relatives à votre formation (non marketing)", en: 'Sending communications related to your training (non-marketing)' },
                  { fr: 'Le traitement des paiements', en: 'Payment processing' },
                ]} />
              </section>
            </Card>

            {/* 4. Base légale */}
            <Card>
              <section id="base">
                <SectionTitle>{fr ? 'Base légale' : 'Legal Basis'}</SectionTitle>
                <p className="text-muted text-sm mb-4">
                  {fr ? 'Le traitement repose sur :' : 'Processing is based on:'}
                </p>
                <BulletList fr={fr} items={[
                  { fr: "L'exécution du contrat (accès à la plateforme et aux formations)", en: 'Contract performance (access to the platform and courses)' },
                  { fr: "L'intérêt légitime (sécurité de la plateforme, prévention de la fraude)", en: 'Legitimate interest (platform security, fraud prevention)' },
                  { fr: 'Le consentement (communications optionnelles)', en: 'Consent (optional communications)' },
                ]} />
              </section>
            </Card>

            {/* 5. Durée de conservation */}
            <Card>
              <section id="duree">
                <SectionTitle>{fr ? 'Durée de conservation' : 'Retention Period'}</SectionTitle>
                <BulletList fr={fr} items={[
                  { fr: 'Données de compte : durée de la relation contractuelle + 3 ans', en: 'Account data: duration of contractual relationship + 3 years' },
                  { fr: 'Données de paiement : conformément aux obligations légales (10 ans)', en: 'Payment data: in accordance with legal obligations (10 years)' },
                  { fr: 'Logs de connexion : 12 mois', en: 'Connection logs: 12 months' },
                  { fr: 'Livrables et corrections : durée de la relation contractuelle', en: 'Deliverables and corrections: duration of contractual relationship' },
                ]} />
              </section>
            </Card>

            {/* 6. Vos droits */}
            <Card>
              <section id="droits">
                <SectionTitle>{fr ? 'Vos droits' : 'Your Rights'}</SectionTitle>
                <p className="text-muted text-sm mb-4">
                  {fr
                    ? 'Conformément au RGPD, vous disposez des droits suivants :'
                    : 'In accordance with the GDPR, you have the following rights:'}
                </p>
                <BulletList fr={fr} items={[
                  { fr: "Droit d'accès à vos données", en: 'Right of access to your data' },
                  { fr: 'Droit de rectification', en: 'Right of rectification' },
                  { fr: "Droit à l'effacement (\"droit à l'oubli\")", en: 'Right to erasure ("right to be forgotten")' },
                  { fr: 'Droit à la portabilité', en: 'Right to data portability' },
                  { fr: "Droit d'opposition et de limitation du traitement", en: 'Right to object and restrict processing' },
                ]} />
                <p className="text-muted text-sm mt-4">
                  {fr ? 'Pour exercer vos droits :' : 'To exercise your rights:'}{' '}
                  <a href="mailto:privacy@guardiancyberlabs.io" style={{ color: '#4a7fc2' }}>
                    privacy@guardiancyberlabs.io
                  </a>
                </p>
              </section>
            </Card>

            {/* 7. Cookies */}
            <Card>
              <section id="cookies">
                <SectionTitle>Cookies</SectionTitle>
                <p className="text-muted text-sm leading-relaxed">
                  {fr
                    ? "Nous utilisons uniquement des cookies strictement nécessaires au fonctionnement de la plateforme (session, sécurité). Aucun cookie publicitaire ou de tracking tiers n'est déposé sans votre consentement explicite."
                    : "We only use cookies strictly necessary for the platform to function (session, security). No advertising or third-party tracking cookies are placed without your explicit consent."}
                </p>
              </section>
            </Card>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default Conditions;