import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LanguageContext } from '../context/LanguageContext';

const PALETTE = {
  red: { main: '#a94442', text: '#c0505a', bg: 'rgba(169,68,66,0.12)', border: 'rgba(169,68,66,0.4)', tagStyle: { color: '#c0505a', border: '1px solid rgba(169,68,66,0.4)', background: 'rgba(169,68,66,0.07)' } },
  blue: { main: '#3b6ea5', text: '#4a7fc2', bg: 'rgba(59,110,165,0.12)', border: 'rgba(59,110,165,0.4)', tagStyle: { color: '#4a7fc2', border: '1px solid rgba(59,110,165,0.4)', background: 'rgba(59,110,165,0.07)' } },
  gold: { main: '#b8974a', text: '#c9a94e', bg: 'rgba(184,151,74,0.12)', border: 'rgba(184,151,74,0.4)', tagStyle: { color: '#c9a94e', border: '1px solid rgba(184,151,74,0.4)', background: 'rgba(184,151,74,0.07)' } },
};

const LEVEL_PALETTE = {
  beginner: { color: '#6a9e6a', border: 'rgba(106,158,106,0.4)', bg: 'rgba(106,158,106,0.08)' },
  intermediate: { color: '#c9a94e', border: 'rgba(201,169,78,0.4)', bg: 'rgba(201,169,78,0.08)' },
  advanced: { color: '#c0505a', border: 'rgba(192,80,90,0.4)', bg: 'rgba(192,80,90,0.08)' },
};

const COURSES = [
  { id: 1, title: 'Introduction au Pentesting', price: '$49', level: 'beginner', level_fr: 'Débutant', duration: '18h', category: 'red_team', label: 'Red Team', palette: PALETTE.red, tags: ['Nmap', 'Metasploit', 'Kali'], image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80' },
  { id: 2, title: 'OWASP Top 10 — Web Offensif', price: '$79', level: 'intermediate', level_fr: 'Intermédiaire', duration: '24h', category: 'red_team', label: 'Red Team', palette: PALETTE.red, tags: ['Burp Suite', 'SQLi', 'XSS'], image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80' },
  { id: 3, title: 'Active Directory Attacks', price: '$99', level: 'advanced', level_fr: 'Avancé', duration: '32h', category: 'red_team', label: 'Red Team', palette: PALETTE.red, tags: ['BloodHound', 'Pass-the-Hash', 'Kerberoast'], image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=600&q=80' },
  { id: 4, title: 'OSINT & Reconnaissance', price: '$39', level: 'intermediate', level_fr: 'Intermédiaire', duration: '12h', category: 'red_team', label: 'Red Team', palette: PALETTE.red, tags: ['Maltego', 'Shodan', 'OSINT'], image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&q=80' },
  { id: 5, title: 'Fondamentaux du SOC', price: '$49', level: 'beginner', level_fr: 'Débutant', duration: '26h', category: 'blue_team', label: 'Blue Team', palette: PALETTE.blue, tags: ['SIEM', 'Splunk', 'Log Analysis'], image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80' },
  { id: 6, title: 'Analyse de Malware', price: '$79', level: 'intermediate', level_fr: 'Intermédiaire', duration: '28h', category: 'blue_team', label: 'Blue Team', palette: PALETTE.blue, tags: ['Wireshark', 'Sandbox', 'RE'], image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80' },
  { id: 7, title: 'Threat Hunting avancé', price: '$99', level: 'advanced', level_fr: 'Avancé', duration: '36h', category: 'blue_team', label: 'Blue Team', palette: PALETTE.blue, tags: ['Threat Intel', 'YARA', 'MITRE ATT&CK'], image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&q=80' },
  { id: 8, title: 'Lecture et analyse de logs', price: '$29', level: 'beginner', level_fr: 'Débutant', duration: '10h', category: 'blue_team', label: 'Blue Team', palette: PALETTE.blue, tags: ['Syslog', 'Windows Events', 'ELK'], image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80' },
  { id: 9, title: 'Introduction ISO 27001', price: '$49', level: 'beginner', level_fr: 'Débutant', duration: '15h', category: 'grc', label: 'GRC', palette: PALETTE.gold, tags: ['ISO 27001', 'SMSI', 'Politique'], image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80' },
  { id: 10, title: 'RGPD : Conformité & DPO', price: '$59', level: 'intermediate', level_fr: 'Intermédiaire', duration: '18h', category: 'grc', label: 'GRC', palette: PALETTE.gold, tags: ['RGPD', 'DPO', 'PIA'], image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
  { id: 11, title: 'Audit de sécurité EBIOS RM', price: '$89', level: 'advanced', level_fr: 'Avancé', duration: '24h', category: 'grc', label: 'GRC', palette: PALETTE.gold, tags: ['EBIOS RM', 'Risque', 'Audit'], image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=600&q=80' },
  { id: 12, title: 'Gestion de crise cyber', price: '$49', level: 'intermediate', level_fr: 'Intermédiaire', duration: '12h', category: 'grc', label: 'GRC', palette: PALETTE.gold, tags: ['PCA', 'Incident', 'Communication'], image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80' },
];

const FILTERS = [
  { key: 'red_team', label: 'Red Team', type: 'category' },
  { key: 'blue_team', label: 'Blue Team', type: 'category' },
  { key: 'grc', label: 'GRC', type: 'category' },
  { key: 'beginner', label: 'Débutant', type: 'level' },
  { key: 'intermediate', label: 'Intermédiaire', type: 'level' },
  { key: 'advanced', label: 'Avancé', type: 'level' },
];

const Catalog = () => {
  const { language } = useContext(LanguageContext);
  const fr = language === 'fr';
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  const toggleFilter = (key) => {
    setActiveFilters(prev =>
      prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
    );
  };

  const filtered = COURSES.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const categoryFilters = activeFilters.filter(f => ['red_team', 'blue_team', 'grc'].includes(f));
    const levelFilters = activeFilters.filter(f => ['beginner', 'intermediate', 'advanced'].includes(f));
    const matchCategory = categoryFilters.length === 0 || categoryFilters.includes(c.category);
    const matchLevel = levelFilters.length === 0 || levelFilters.includes(c.level);
    return matchSearch && matchCategory && matchLevel;
  });

  return (
    <div className="min-h-screen text-white font-sans bg-base">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="font-mono text-xs text-primary tracking-widest mb-3">[ CATALOGUE ]</p>
        <h1 className="font-display text-4xl font-bold mb-10">
          {fr ? 'Toutes les formations' : 'All courses'}
        </h1>

        {/* Recherche */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={fr ? 'Rechercher une formation…' : 'Search a course…'}
            className="w-full bg-surface border border-white/10 rounded-xl pl-12 pr-6 py-4 text-sm text-white placeholder:text-muted outline-none focus:border-primary/50 transition-all"
          />
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map(f => {
            const isActive = activeFilters.includes(f.key);
            let activeStyle = {};
            if (isActive) {
              if (f.key === 'red_team') activeStyle = { background: 'rgba(169,68,66,0.15)', border: '1px solid rgba(169,68,66,0.5)', color: '#c0505a' };
              else if (f.key === 'blue_team') activeStyle = { background: 'rgba(59,110,165,0.15)', border: '1px solid rgba(59,110,165,0.5)', color: '#4a7fc2' };
              else if (f.key === 'grc') activeStyle = { background: 'rgba(184,151,74,0.15)', border: '1px solid rgba(184,151,74,0.5)', color: '#c9a94e' };
              else activeStyle = { background: 'rgba(59,109,240,0.12)', border: '1px solid rgba(59,109,240,0.4)', color: '#6090f8' };
            }
            return (
              <button key={f.key} onClick={() => toggleFilter(f.key)}
                className="font-mono text-xs px-4 py-2 rounded-lg transition-all"
                style={isActive ? activeStyle : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#8A93A6' }}>
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Grille */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted text-sm">
            {fr ? 'Aucune formation trouvée.' : 'No course found.'}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map(course => {
              const levelP = LEVEL_PALETTE[course.level];
              return (
                <Link key={course.id} to={`/course/${course.id}`}
                  className="group rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-2px]"
                  style={{ background: '#0d1220' }}>
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img src={course.image} alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ filter: 'brightness(0.7) saturate(0.8)' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0d1220 0%, transparent 60%)' }} />
                    <span className="absolute top-3 left-3 font-mono text-[10px] font-semibold px-2.5 py-1 rounded"
                      style={{ color: course.palette.text, background: course.palette.bg, border: `1px solid ${course.palette.border}` }}>
                      {course.label}
                    </span>
                  </div>

                  {/* Contenu */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-display text-sm font-bold text-white leading-snug group-hover:text-primary-light transition-colors flex-1">
                        {course.title}
                      </h3>
                      <span className="font-mono text-sm font-bold shrink-0" style={{ color: '#4a7fc2' }}>
                        {course.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded"
                        style={{ color: levelP.color, border: `1px solid ${levelP.border}`, background: levelP.bg }}>
                        {fr ? course.level_fr : course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                      </span>
                      <span className="text-muted text-[10px] font-mono">{course.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {course.tags.map(tag => (
                        <span key={tag} className="font-mono text-[9px] px-2 py-0.5 rounded" style={course.palette.tagStyle}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Communauté */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-mono text-xs text-primary tracking-widest mb-3">[ COMMUNITY ]</p>
          <h2 className="font-display text-2xl font-bold mb-3">
            {fr ? 'Rejoins la communauté' : 'Join the community'}
          </h2>
          <p className="text-muted text-sm max-w-md mx-auto mb-8">
            {fr ? "Pose tes questions, partage tes découvertes, construis ton réseau." : 'Ask questions, share discoveries, build your network.'}
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
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
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default Catalog;