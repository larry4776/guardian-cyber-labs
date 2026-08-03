import React, { useContext } from 'react';
import { Shield, Crosshair, ScrollText } from 'lucide-react';
import Navbar from '../components/Navbar';
import { LanguageContext } from '../context/LanguageContext';

const About = () => {
  const { language } = useContext(LanguageContext);
  const fr = language === 'fr';

  return (
    <div className="min-h-screen text-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-3xl mx-auto px-6 py-20">
        <h1 className="font-display text-3xl font-bold mb-2 tracking-tight">GUARDIAN CYBER LABS</h1>
        <p className="text-muted text-sm mb-8">
          {fr ? "Branche formation d'AVALON SECURE" : 'Training branch of AVALON SECURE'}
        </p>

        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          {fr
            ? "GUARDIAN CYBER LABS est une plateforme internationale de formation pratique en cybersécurité, structurée autour de trois domaines : Red Team, Blue Team et GRC, chacun décliné en trois niveaux de progression."
            : 'GUARDIAN CYBER LABS is an international practical cybersecurity training platform, structured around three domains: Red Team, Blue Team and GRC, each divided into three progression levels.'}
        </p>

        <h2 className="font-display text-xl font-bold mb-3 mt-10">{fr ? 'Notre mission' : 'Our mission'}</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          {fr
            ? "Offrir un apprentissage ciblé et pratique, sans détour obligatoire par un cursus réseau ou développement classique. Chaque apprenant choisit directement son domaine d'intérêt et progresse vers des compétences réellement opérationnelles."
            : 'Provide targeted, practical learning without a mandatory detour through a classic networking or development curriculum. Each learner chooses their domain of interest directly and progresses toward truly operational skills.'}
        </p>

        <h2 className="font-display text-xl font-bold mb-4 mt-10">{fr ? 'Nos trois domaines' : 'Our three domains'}</h2>
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 bg-surface border border-white/10 rounded-xl p-4">
            <Crosshair size={18} className="text-primary-light mt-0.5 shrink-0" />
            <p className="text-sm text-slate-400"><span className="text-white font-semibold">Red Team</span> — {fr ? "sécurité offensive : reconnaissance, exploitation, méthodologie de test d'intrusion." : 'offensive security: reconnaissance, exploitation, penetration testing methodology.'}</p>
          </div>
          <div className="flex items-start gap-3 bg-surface border border-white/10 rounded-xl p-4">
            <Shield size={18} className="text-primary-light mt-0.5 shrink-0" />
            <p className="text-sm text-slate-400"><span className="text-white font-semibold">Blue Team</span> — {fr ? 'sécurité défensive : supervision, détection, réponse à incident.' : 'defensive security: monitoring, detection, incident response.'}</p>
          </div>
          <div className="flex items-start gap-3 bg-surface border border-white/10 rounded-xl p-4">
            <ScrollText size={18} className="text-primary-light mt-0.5 shrink-0" />
            <p className="text-sm text-slate-400"><span className="text-white font-semibold">GRC</span> — {fr ? 'gouvernance, risque et conformité : audit, gestion des risques, cadre normatif.' : 'governance, risk and compliance: auditing, risk management, regulatory frameworks.'}</p>
          </div>
        </div>

        <h2 className="font-display text-xl font-bold mb-3 mt-10">{fr ? 'Notre engagement' : 'Our commitment'}</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          {fr
            ? "Chaque étudiant s'engage à utiliser les compétences acquises dans un cadre strictement légal et éthique. La certification GUARDIAN CYBER LABS repose sur des livrables professionnels réels, corrigés par des humains, pas uniquement sur des exercices automatisés."
            : 'Every student commits to using the skills acquired within a strictly legal and ethical framework. GUARDIAN CYBER LABS certification is based on real professional deliverables, graded by humans, not only on automated exercises.'}
        </p>
      </div>
    </div>
  );
};
export default About;