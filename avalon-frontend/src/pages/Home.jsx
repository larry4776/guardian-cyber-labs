import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Users, Award, BookOpen, Star } from 'lucide-react';
import PaymentModal from '../components/paymentModal';
import Navbar from '../components/Navbar';
import { LanguageContext } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { API_URL } from '../config';

const DOMAIN_LABELS = {
  red_team: { fr: 'Red Team', en: 'Red Team' },
  blue_team: { fr: 'Blue Team', en: 'Blue Team' },
  grc: { fr: 'GRC', en: 'GRC' },
};
const LEVEL_LABELS = {
  beginner: { fr: 'Débutant', en: 'Beginner' },
  intermediate: { fr: 'Intermédiaire', en: 'Intermediate' },
  advanced: { fr: 'Avancé', en: 'Advanced' },
};

const getCourseImage = (course) => {
  if (course.thumbnail_url) return course.thumbnail_url;
  const domainImages = {
    red_team: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600',
    blue_team: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600',
    grc: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600',
  };
  return domainImages[course.domain] || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600';
};

const getCourseDuration = (course) => {
  if (!course.lessons || course.lessons.length === 0) return null;
  const total = course.lessons.reduce((acc, l) => {
    const parts = (l.duration || '0:00').split(':').map(Number);
    return acc + parts[0] * 60 + (parts[1] || 0);
  }, 0);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h > 0) return `${h}h${m.toString().padStart(2, '0')}`;
  return `${m} min`;
};

const DEFAULT_TESTIMONIALS = {
  fr: [
    { name: 'Koffi A.', role: 'Analyste SOC', text: 'Les parcours sont vraiment pratiques, j\'ai pu appliquer directement ce que j\'ai appris en entreprise. La certification m\'a ouvert des portes.', stars: 5 },
    { name: 'Mariama D.', role: 'Étudiante en cybersécurité', text: 'Le module Blue Team est excellent. Les exercices pratiques sont bien pensés et la correction manuelle des livrables est un vrai plus.', stars: 5 },
    { name: 'Ibrahim S.', role: 'Consultant GRC', text: 'J\'ai validé ma certification GRC en quelques semaines. Le contenu est dense et de qualité, adapté aux réalités du marché africain.', stars: 5 },
  ],
  en: [
    { name: 'Koffi A.', role: 'SOC Analyst', text: 'The courses are truly practical. I was able to directly apply what I learned at work. The certification opened new doors for me.', stars: 5 },
    { name: 'Mariama D.', role: 'Cybersecurity student', text: 'The Blue Team module is excellent. The practical exercises are well-designed and the manual grading of deliverables is a real plus.', stars: 5 },
    { name: 'Ibrahim S.', role: 'GRC Consultant', text: 'I validated my GRC certification in a few weeks. The content is dense and high quality, adapted to African market realities.', stars: 5 },
  ],
};

const TERMINAL_LINES = [
  { text: 'guardian@cyber-labs:~$ init --scan', delay: 0, color: 'text-emerald-400' },
  { text: '> Scanning 254 hosts...', delay: 800, color: 'text-slate-400' },
  { text: '> [████████░░] 82% complete', delay: 1600, color: 'text-slate-400' },
  { text: '[+] Host 192.168.1.42 — port 22/tcp OPEN', delay: 2400, color: 'text-emerald-400' },
  { text: '[+] Host 192.168.1.105 — port 443/tcp OPEN', delay: 3000, color: 'text-emerald-400' },
  { text: '[!] CVE-2023-38408 — OpenSSH vuln DETECTED', delay: 3800, color: 'text-red-400' },
  { text: '[+] Generating report...', delay: 4600, color: 'text-slate-400' },
  { text: '> Report saved to /output/scan_report.pdf', delay: 5400, color: 'text-blue-400' },
];

const TerminalWidget = () => {
  const [visibleLines, setVisibleLines] = useState([]);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    TERMINAL_LINES.forEach((line) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, line]);
      }, line.delay);
    });
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="bg-[#0D1117] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
        <span className="ml-3 text-xs text-muted font-mono">guardian@cyber-labs: ~</span>
      </div>
      <div className="p-5 font-mono text-xs space-y-1.5 min-h-[220px]">
        {visibleLines.map((line, i) => (
          <div key={i} className={`${line.color} leading-relaxed`}>{line.text}</div>
        ))}
        {visibleLines.length < TERMINAL_LINES.length && (
          <span className={`text-emerald-400 ${showCursor ? 'opacity-100' : 'opacity-0'}`}>▋</span>
        )}
      </div>
    </div>
  );
};

const Home = () => {
  const { language, t } = useContext(LanguageContext);
  const { settings, formatPrice } = useSettings();
  const fr = language === 'fr';
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === '/') { e.preventDefault(); searchRef.current?.focus(); } };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/courses/`)
      .then(res => { if (!res.ok) throw new Error('Impossible de charger les parcours.'); return res.json(); })
      .then(data => setCourses(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const suggestions = search.length > 0 ? courses.filter(c => t(c, 'title_fr', 'title_en').toLowerCase().includes(search.toLowerCase())) : [];

  // Témoignages dynamiques depuis l'admin, sinon défaut
  let testimonials = DEFAULT_TESTIMONIALS[language] || DEFAULT_TESTIMONIALS.fr;
  if (settings.testimonials) {
    try {
      const parsed = JSON.parse(settings.testimonials);
      if (parsed.length > 0) testimonials = parsed;
    } catch {}
  }

  const statsData = [
    { icon: <Users size={22} className="text-primary-light" />, value: settings.stats_learners || '500+', label: fr ? 'Apprenants inscrits' : 'Enrolled learners' },
    { icon: <Award size={22} className="text-primary-light" />, value: settings.stats_certified || '120+', label: fr ? 'Certifiés' : 'Certified students' },
    { icon: <BookOpen size={22} className="text-primary-light" />, value: settings.stats_courses || '9', label: fr ? 'Parcours disponibles' : 'Available courses' },
    { icon: <Star size={22} className="text-primary-light" />, value: settings.stats_rating || '4.8/5', label: fr ? 'Note moyenne' : 'Average rating' },
  ];

  return (
    <div className="min-h-screen text-white font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,black_30%,transparent_100%)]"></div>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Red Team</span>
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Blue Team</span>
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">GRC</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.1] mb-6 tracking-tight">
                {fr ? (<>La cybersécurité opérationnelle,<br /><span className="text-primary-light">sans détour.</span></>) : (<>Operational cybersecurity,<br /><span className="text-primary-light">straight to the point.</span></>)}
              </h1>
              <p className="text-muted text-base leading-relaxed mb-8 max-w-lg">
                {fr ? 'Zéro prérequis imposé. Des compétences directement employables. Des livrables réels corrigés par des humains.' : 'Zero imposed prerequisites. Directly employable skills. Real deliverables graded by humans.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link to="/catalog" className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] text-white font-semibold px-7 py-3.5 rounded-lg transition-shadow duration-300 text-sm">
                  {fr ? 'Voir le catalogue' : 'View catalog'} <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/about" className="inline-flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 text-slate-200 font-semibold px-7 py-3.5 rounded-lg transition-colors text-sm">
                  {fr ? "L'Académie" : 'Academy'}
                </Link>
              </div>
              <div className="relative max-w-sm">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input ref={searchRef} value={search}
                  onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder={fr ? 'Rechercher un parcours...' : 'Search a course...'}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-full pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-muted outline-none focus:border-primary/50 transition-all" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-muted border border-white/10 rounded px-1.5 py-0.5">/</span>
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-white/10 rounded-xl overflow-hidden shadow-2xl z-30">
                    {suggestions.map(c => (
                      <Link key={c.id} to={`/course/${c.id}`} className="block px-5 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                        <p className="text-sm font-semibold text-white">{t(c, 'title_fr', 'title_en')}</p>
                        <p className="text-xs text-muted">{formatPrice(c.price, c.is_free, language)}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:block">
              <TerminalWidget />
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres clés dynamiques */}
      <section className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {statsData.map((stat, i) => (
            <div key={i} className="bg-surface border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center gap-3">
              {stat.icon}
              <span className="font-display text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-muted text-xs">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Parcours */}
      <section className="relative max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-display text-2xl font-bold">{fr ? 'Nos parcours' : 'Our courses'}</h2>
          <Link to="/catalog" className="text-sm font-semibold text-primary-light hover:text-white transition-colors flex items-center gap-1 group">
            {fr ? 'Voir tout le catalogue' : 'View full catalog'} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <p className="text-muted text-sm">{fr ? 'Chargement des parcours...' : 'Loading courses...'}</p>
        ) : error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {courses.slice(0, 6).map(course => {
              const duration = getCourseDuration(course);
              const domainColor = {
                red_team: 'bg-red-500/10 text-red-400 border-red-500/20',
                blue_team: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                grc: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
              }[course.domain] || 'bg-primary/10 text-primary-light border-primary/20';

              return (
                <div key={course.id} className="group relative bg-surface border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 shadow-xl flex flex-col">
                  <div className="relative h-40 overflow-hidden">
                    <img src={getCourseImage(course)} alt={t(course, 'title_fr', 'title_en')} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
                    {course.is_bestseller && <span className="absolute top-3 left-3 bg-amber-400 text-slate-900 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded">{fr ? 'Meilleure vente' : 'Bestseller'}</span>}
                    {duration && (
                      <span className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">{duration}</span>
                    )}
                  </div>
                  <div className="relative p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className={`text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full border ${domainColor}`}>
                          {DOMAIN_LABELS[course.domain]?.[language] || course.domain}
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-white/5 text-muted border border-white/10">
                          {LEVEL_LABELS[course.level]?.[language] || course.level}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold mb-1 leading-snug group-hover:text-primary-light transition-colors">{t(course, 'title_fr', 'title_en')}</h3>
                      {course.instructor_name && (
                        <div className="flex items-center gap-2 mb-2">
                          {course.instructor_avatar ? (
                            <img src={course.instructor_avatar} alt={course.instructor_name} className="w-5 h-5 rounded-full object-cover" />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary-light">
                              {course.instructor_name[0]?.toUpperCase()}
                            </div>
                          )}
                          <p className="text-xs text-muted">{fr ? 'Par' : 'By'} {course.instructor_name}</p>
                        </div>
                      )}
                      <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">{t(course, 'description_fr', 'description_en')}</p>
                    </div>
                    <div className="flex gap-3 items-center justify-between">
                      <span className="font-display text-sm text-primary-light font-bold">
                        {formatPrice(course.price, course.is_free, language)}
                      </span>
                      <div className="flex gap-2">
                        <Link to={`/course/${course.id}`} className="text-center border border-white/10 hover:border-white/30 text-slate-300 hover:text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors">
                          {fr ? 'Détails' : 'Details'}
                        </Link>
                        <button onClick={() => setSelectedCourse(course)} className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-shadow">
                          {course.is_free ? (fr ? 'Accéder' : 'Access') : (fr ? 'Débloquer' : 'Unlock')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Témoignages dynamiques */}
      <section className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-bold mb-2">{fr ? 'Ce que disent nos apprenants' : 'What our learners say'}</h2>
            <p className="text-muted text-sm">{fr ? 'Des retours concrets de personnes qui ont suivi nos parcours.' : 'Real feedback from people who completed our courses.'}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-surface border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex gap-1">
                  {[...Array(t.stars)].map((_, s) => (
                    <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-muted text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedCourse && <PaymentModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
    </div>
  );
};
export default Home;