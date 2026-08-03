import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Search } from 'lucide-react';
import PaymentModal from '../components/paymentModal';
import Navbar from '../components/Navbar';
import { LanguageContext } from '../context/LanguageContext';
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

const Home = () => {
  const { language, t } = useContext(LanguageContext);
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

  return (
    <div className="min-h-screen text-white font-sans">
      <Navbar />

      <section className="relative border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_20%,transparent_100%)]"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/20 blur-[130px] rounded-full"></div>
          <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-accent/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-6 py-28">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wide text-primary-light bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
            <Shield size={12} />
            {fr ? 'Écosystème académique international' : 'International academic ecosystem'}
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
            {fr ? "Déployez vos compétences d'élite avec" : 'Deploy your elite skills with'}<br />
            <span className="bg-gradient-to-r from-primary-light via-accent to-primary-light bg-clip-text text-transparent">GUARDIAN CYBER LABS</span>
          </h1>
          <p className="text-muted max-w-xl mx-auto mb-10 text-base leading-relaxed">
            {fr
              ? 'Red Team, Blue Team, GRC — une formation pratique en cybersécurité, portée par AVALON SECURE.'
              : 'Red Team, Blue Team, GRC — practical cybersecurity training, powered by AVALON SECURE.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link to="/catalog" className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] text-white font-semibold px-8 py-3.5 rounded-lg transition-shadow duration-300">
              {fr ? 'Explorer les parcours' : 'Explore courses'}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=avalonsecure7@gmail.com&su=Contact%20Guardian%20Cyber%20Labs" target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 text-slate-200 font-semibold px-8 py-3.5 rounded-lg transition-colors">
              {fr ? 'Nous contacter' : 'Contact us'}
            </a>
          </div>

          <div className="relative max-w-md mx-auto z-20">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder={fr ? 'Rechercher un parcours...' : 'Search a course...'}
              className="w-full bg-white/[0.03] border border-white/10 rounded-full pl-11 pr-12 py-3 text-sm text-white placeholder:text-muted outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-muted border border-white/10 rounded px-1.5 py-0.5">/</span>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-white/10 rounded-xl overflow-hidden shadow-2xl z-30 text-left">
                {suggestions.map(c => (
                  <Link key={c.id} to={`/course/${c.id}`} className="block px-5 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                    <p className="text-sm font-semibold text-white">{t(c, 'title_fr', 'title_en')}</p>
                    <p className="text-xs text-muted">{c.is_free ? (fr ? 'Gratuit' : 'Free') : `$${c.price}`}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-display text-2xl font-bold">{fr ? 'Nos parcours' : 'Our courses'}</h2>
          <Link to="/catalog" className="text-sm font-semibold text-primary-light hover:text-white transition-colors flex items-center gap-1 group">
            {fr ? 'Voir tout le catalogue' : 'View full catalog'}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <p className="text-muted text-sm">{fr ? 'Chargement des parcours...' : 'Loading courses...'}</p>
        ) : error ? (
          <p className="text-red-400 text-sm">{error} — vérifie que le serveur backend tourne bien sur {API_URL}.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {courses.slice(0, 6).map(course => (
              <div key={course.id} className="group relative bg-surface border border-white/10 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 shadow-xl flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/0 via-primary/0 to-primary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative h-40 overflow-hidden">
                  <img src={course.thumbnail_url || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600'} alt={t(course, 'title_fr', 'title_en')} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
                  {course.is_bestseller && <span className="absolute top-3 left-3 bg-amber-400 text-slate-900 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded">{fr ? 'Meilleure vente' : 'Bestseller'}</span>}
                </div>
                <div className="relative p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-primary/10 text-primary-light border border-primary/20">
                        {DOMAIN_LABELS[course.domain]?.[language] || course.domain}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-white/5 text-muted border border-white/10">
                        {LEVEL_LABELS[course.level]?.[language] || course.level}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold mb-1 leading-snug group-hover:text-primary-light transition-colors">{t(course, 'title_fr', 'title_en')}</h3>
                    {course.instructor_name && <p className="text-xs text-muted mb-2">{fr ? 'Par' : 'By'} {course.instructor_name}</p>}
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">{t(course, 'description_fr', 'description_en')}</p>
                  </div>
                  <div className="flex gap-3 items-center justify-between">
                    <span className="font-display text-sm text-primary-light font-bold">{course.is_free ? (fr ? 'Gratuit' : 'Free') : `$${course.price}`}</span>
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
            ))}
          </div>
        )}
      </section>

      {selectedCourse && <PaymentModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
    </div>
  );
};
export default Home;