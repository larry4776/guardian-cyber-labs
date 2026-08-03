import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import PaymentModal from '../components/paymentModal';
import Navbar from '../components/Navbar';
import { LanguageContext } from '../context/LanguageContext';
import { API_URL } from '../config';

const DOMAINS = [
  { key: 'red_team', label_fr: 'Red Team', label_en: 'Red Team' },
  { key: 'blue_team', label_fr: 'Blue Team', label_en: 'Blue Team' },
  { key: 'grc', label_fr: 'GRC', label_en: 'GRC' },
];
const LEVELS = [
  { key: 'beginner', label_fr: 'Débutant', label_en: 'Beginner' },
  { key: 'intermediate', label_fr: 'Intermédiaire', label_en: 'Intermediate' },
  { key: 'advanced', label_fr: 'Avancé', label_en: 'Advanced' },
];

const Catalog = () => {
  const { language, t } = useContext(LanguageContext);
  const fr = language === 'fr';
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('Tous');
  const [level, setLevel] = useState('Tous');
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/courses/`)
      .then(res => { if (!res.ok) throw new Error('Impossible de charger les parcours.'); return res.json(); })
      .then(data => setCourses(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c =>
    (domain === 'Tous' || c.domain === domain) &&
    (level === 'Tous' || c.level === level) &&
    t(c, 'title_fr', 'title_en').toLowerCase().includes(search.toLowerCase())
  );

  const label = (item) => language === 'fr' ? item.label_fr : item.label_en;

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        <h1 className="font-display text-3xl font-bold mb-2 tracking-tight">{fr ? 'Catalogue des parcours' : 'Course catalog'}</h1>
        <p className="text-muted text-sm mb-8">Red Team, Blue Team, GRC — {fr ? 'trois niveaux par domaine.' : 'three levels per domain.'}</p>

        <div className="relative w-full md:w-96 mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={fr ? 'Rechercher un parcours...' : 'Search a course...'}
            className="w-full bg-white/[0.03] border border-white/10 rounded-full pl-11 pr-5 py-3 text-sm text-white placeholder:text-muted outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setDomain('Tous')} className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide border transition-colors ${domain === 'Tous' ? 'border-primary/50 bg-primary/10 text-primary-light' : 'border-white/10 text-muted hover:border-white/25'}`}>
            {fr ? 'Tous les domaines' : 'All domains'}
          </button>
          {DOMAINS.map(d => (
            <button key={d.key} onClick={() => setDomain(d.key)} className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide border transition-colors ${domain === d.key ? 'border-primary/50 bg-primary/10 text-primary-light' : 'border-white/10 text-muted hover:border-white/25'}`}>{label(d)}</button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          <button onClick={() => setLevel('Tous')} className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide border transition-colors ${level === 'Tous' ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 text-muted hover:border-white/25'}`}>
            {fr ? 'Tous les niveaux' : 'All levels'}
          </button>
          {LEVELS.map(l => (
            <button key={l.key} onClick={() => setLevel(l.key)} className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide border transition-colors ${level === l.key ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 text-muted hover:border-white/25'}`}>{label(l)}</button>
          ))}
        </div>

        {loading ? (
          <p className="text-muted text-sm">{fr ? 'Chargement des parcours...' : 'Loading courses...'}</p>
        ) : error ? (
          <p className="text-red-400 text-sm">{error} — vérifie que le serveur backend tourne bien sur {API_URL}.</p>
        ) : filtered.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map(course => (
              <div key={course.id} className="group relative bg-surface border border-white/10 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 shadow-xl flex flex-col">
                <div className="relative h-40 overflow-hidden">
                  <img src={course.thumbnail_url || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600'} alt={t(course, 'title_fr', 'title_en')} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
                  {course.is_bestseller && <span className="absolute top-3 left-3 bg-amber-400 text-slate-900 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded">{fr ? 'Meilleure vente' : 'Bestseller'}</span>}
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-primary/10 text-primary-light border border-primary/20">
                        {label(DOMAINS.find(d => d.key === course.domain)) || course.domain}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-white/5 text-muted border border-white/10">
                        {label(LEVELS.find(l => l.key === course.level)) || course.level}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold mb-1 leading-snug group-hover:text-primary-light transition-colors">{t(course, 'title_fr', 'title_en')}</h3>
                    {course.instructor_name && <p className="text-xs text-muted mb-2">{fr ? 'Par' : 'By'} {course.instructor_name}</p>}
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">{t(course, 'description_fr', 'description_en')}</p>
                  </div>
                  <div className="flex gap-3">
                    <Link to={`/course/${course.id}`} className="flex-1 text-center border border-white/10 hover:border-white/30 text-slate-300 hover:text-white font-semibold py-3 rounded-lg text-sm transition-colors">
                      {fr ? 'Détails' : 'Details'}
                    </Link>
                    <button onClick={() => setSelectedCourse(course)} className="flex-1 bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] text-white font-semibold py-3 rounded-lg text-sm transition-shadow">
                      {course.is_free ? (fr ? 'Accéder' : 'Access') : (fr ? 'Débloquer' : 'Unlock')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center text-muted text-sm">
            {fr ? 'Aucun parcours trouvé.' : 'No course found.'}
          </div>
        )}
      </section>
      {selectedCourse && <PaymentModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
    </div>
  );
};
export default Catalog;