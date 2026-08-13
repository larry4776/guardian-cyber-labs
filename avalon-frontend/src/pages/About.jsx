import React, { useContext } from 'react';
import { Shield, Crosshair, ScrollText, Users, Award, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LanguageContext } from '../context/LanguageContext';

const About = () => {
  const { language } = useContext(LanguageContext);
  const fr = language === 'fr';

  return (
    <div className="min-h-screen text-white flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_20%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wide text-primary-light bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
            <Shield size={12} />
            AVALON SECURE
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            GUARDIAN <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">CYBER LABS</span>
          </h1>
          <p className="text-muted text-base leading-relaxed max-w-2xl mx-auto mb-8">
            {fr
              ? "La première plateforme d'e-learning en cybersécurité dédiée au public franco-africain, portée par AVALON SECURE."
              : 'The first cybersecurity e-learning platform dedicated to the Franco-African audience, powered by AVALON SECURE.'}
          </p>
          <Link to="/catalog" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-shadow">
            {fr ? 'Voir les parcours' : 'View courses'} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Users size={22} className="text-primary-light" />, value: '500+', label: fr ? 'Apprenants' : 'Learners' },
            { icon: <Award size={22} className="text-primary-light" />, value: '120+', label: fr ? 'Certifiés' : 'Certified' },
            { icon: <BookOpen size={22} className="text-primary-light" />, value: '9', label: fr ? 'Parcours' : 'Courses' },
            { icon: <Shield size={22} className="text-primary-light" />, value: '3', label: fr ? 'Domaines' : 'Domains' },
          ].map((stat, i) => (
            <div key={i} className="bg-surface border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center gap-3">
              {stat.icon}
              <span className="font-display text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-muted text-xs">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-6">
        <h2 className="font-display text-2xl font-bold">{fr ? 'Notre mission' : 'Our mission'}</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          {fr
            ? "GUARDIAN CYBER LABS est une plateforme internationale de formation pratique en cybersécurité, structurée autour de trois domaines : Red Team, Blue Team et GRC, chacun décliné en trois niveaux de progression. Notre objectif est d'offrir un apprentissage ciblé et pratique, sans détour obligatoire par un cursus réseau ou développement classique."
            : 'GUARDIAN CYBER LABS is an international practical cybersecurity training platform, structured around three domains: Red Team, Blue Team and GRC, each divided into three progression levels. Our goal is to provide targeted, practical learning without a mandatory detour through a classic networking or development curriculum.'}
        </p>
        <p className="text-slate-400 text-sm leading-relaxed">
          {fr
            ? "Chaque apprenant choisit directement son domaine d'intérêt et progresse vers des compétences réellement opérationnelles, validées par des livrables professionnels corrigés manuellement par des formateurs expérimentés."
            : 'Each learner directly chooses their domain of interest and progresses toward truly operational skills, validated by professional deliverables manually graded by experienced instructors.'}
        </p>
      </section>

      {/* 3 domaines */}
      <section className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="font-display text-2xl font-bold mb-8">{fr ? 'Nos trois domaines' : 'Our three domains'}</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-surface border border-white/10 rounded-2xl p-6 hover:border-red-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <Crosshair size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Red Team</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {fr
                    ? "Sécurité offensive : reconnaissance, exploitation, méthodologie de test d'intrusion. Tu apprendras à penser comme un attaquant pour mieux défendre."
                    : 'Offensive security: reconnaissance, exploitation, penetration testing methodology. You will learn to think like an attacker to better defend.'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-surface border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Shield size={20} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Blue Team</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {fr
                    ? "Sécurité défensive : supervision, détection, réponse à incident. Tu maîtriseras les outils et méthodes pour protéger les systèmes d'information."
                    : 'Defensive security: monitoring, detection, incident response. You will master the tools and methods to protect information systems.'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-surface border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <ScrollText size={20} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">GRC</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {fr
                    ? "Gouvernance, risque et conformité : audit, gestion des risques, cadre normatif (ISO 27001, RGPD). Tu deviendras un expert de la conformité réglementaire."
                    : 'Governance, risk and compliance: auditing, risk management, regulatory frameworks (ISO 27001, GDPR). You will become an expert in regulatory compliance.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Aperçu de la plateforme */}
      <section className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="font-display text-2xl font-bold mb-3">{fr ? 'La plateforme en action' : 'The platform in action'}</h2>
          <p className="text-muted text-sm mb-8">
            {fr
              ? 'Un environnement d\'apprentissage complet — vidéos, exercices pratiques, livrables, certificats.'
              : 'A complete learning environment — videos, practical exercises, deliverables, certificates.'}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: fr ? 'Catalogue des parcours' : 'Course catalog', desc: fr ? 'Filtrez par domaine et niveau, accédez aux détails de chaque parcours.' : 'Filter by domain and level, access each course details.', img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600' },
              { title: fr ? 'Lecteur de cours' : 'Course player', desc: fr ? 'Vidéos à la demande, programme structuré, progression suivie automatiquement.' : 'On-demand videos, structured curriculum, automatically tracked progress.', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600' },
              { title: fr ? 'Exercices pratiques' : 'Practical exercises', desc: fr ? 'Terminal simulé, analyses de fichiers, scénarios de décision réalistes.' : 'Simulated terminal, file analysis, realistic decision scenarios.', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600' },
              { title: fr ? 'Certification' : 'Certification', desc: fr ? 'Certificat PDF officiel généré après validation de ton livrable final.' : 'Official PDF certificate generated after validation of your final deliverable.', img: 'https://images.unsplash.com/photo-1523289333742-be1143f6b766?w=600' },
            ].map((item, i) => (
              <div key={i} className="bg-surface border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-colors">
                <div className="h-36 overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
                  <p className="text-muted text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement */}
      <section className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="font-display text-2xl font-bold mb-4">{fr ? 'Notre engagement' : 'Our commitment'}</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            {fr
              ? "Chaque étudiant s'engage à utiliser les compétences acquises dans un cadre strictement légal et éthique. La certification GUARDIAN CYBER LABS repose sur des livrables professionnels réels, corrigés par des humains, pas uniquement sur des exercices automatisés."
              : 'Every student commits to using the skills acquired within a strictly legal and ethical framework. GUARDIAN CYBER LABS certification is based on real professional deliverables, graded by humans, not only on automated exercises.'}
          </p>
          <Link to="/catalog" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-shadow">
            {fr ? 'Commencer maintenant' : 'Start now'} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default About;