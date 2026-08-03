import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { LanguageContext } from '../context/LanguageContext';

const CONTENT = {
  fr: {
    title: "Conditions d'utilisation",
    updated: "Dernière mise à jour",
    sections: [
      { h: "1. Objet de la plateforme", p: "GUARDIAN CYBER LABS, branche formation d'AVALON SECURE, propose des parcours en cybersécurité (Red Team, Blue Team, GRC) à but exclusivement pédagogique. Les connaissances et outils présentés sont destinés à un usage légal, dans un cadre d'apprentissage ou d'audit autorisé." },
      { h: "2. Engagement éthique de l'utilisateur", p: "En créant un compte, l'utilisateur s'engage formellement à n'utiliser les techniques et outils enseignés que sur des systèmes lui appartenant ou avec accord explicite du propriétaire, à ne jamais les utiliser à des fins malveillantes, et à respecter la législation en vigueur dans son pays." },
      { h: "3. Responsabilité", p: "Toute utilisation des compétences acquises sur cette plateforme à des fins illégales ou non autorisées relève de la seule responsabilité de l'utilisateur." },
      { h: "4. Compte utilisateur", p: "Chaque utilisateur est responsable de la confidentialité de ses identifiants de connexion." },
      { h: "5. Accès aux parcours et paiement", p: "L'accès aux parcours premium est accordé après paiement effectif via l'un des moyens proposés sur la plateforme. L'accès est valable à vie pour le parcours concerné." },
      { h: "6. Modification des conditions", p: "GUARDIAN CYBER LABS se réserve le droit de modifier ces conditions à tout moment." },
    ],
    back: "← Retour à l'inscription",
  },
  en: {
    title: "Terms of Use",
    updated: "Last updated",
    sections: [
      { h: "1. Purpose of the platform", p: "GUARDIAN CYBER LABS, the training branch of AVALON SECURE, offers cybersecurity courses (Red Team, Blue Team, GRC) for strictly educational purposes. The knowledge and tools presented are intended for legal use, within an authorized learning or auditing context." },
      { h: "2. User's ethical commitment", p: "By creating an account, the user formally commits to only use the techniques and tools taught on systems they own or with explicit owner consent, to never use them for malicious purposes, and to comply with the laws in force in their country." },
      { h: "3. Liability", p: "Any use of the skills acquired on this platform for illegal or unauthorized purposes is the sole responsibility of the user." },
      { h: "4. User account", p: "Each user is responsible for the confidentiality of their login credentials." },
      { h: "5. Course access and payment", p: "Access to premium courses is granted after actual payment through one of the methods offered on the platform. Access is valid for life for the relevant course." },
      { h: "6. Changes to these terms", p: "GUARDIAN CYBER LABS reserves the right to modify these terms at any time." },
    ],
    back: "← Back to registration",
  },
};

const Conditions = () => {
  const { language } = useContext(LanguageContext);
  const c = CONTENT[language];

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">{c.title}</h1>
        <p className="text-slate-500 text-sm mb-10">{c.updated} : {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
          {c.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-lg font-bold text-white mb-3">{s.h}</h2>
              <p>{s.p}</p>
            </section>
          ))}
        </div>

        <Link to="/register" className="inline-block mt-12 text-blue-400 hover:text-blue-300 font-semibold text-sm">{c.back}</Link>
      </div>
    </div>
  );
};
export default Conditions;