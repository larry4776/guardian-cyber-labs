import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Video, FileText, Smartphone, Infinity, Award, Lock, CheckCircle2 } from 'lucide-react';
import PaymentModal from '../components/paymentModal';
import ExerciseBlock from '../components/ExerciseBlock';
import SubmissionBlock from '../components/SubmissionBlock';
import Navbar from '../components/Navbar';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
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

const CourseDetails = () => {
  const { id } = useParams();
  const { language, t } = useContext(LanguageContext);
  const { token } = useContext(AuthContext);
  const fr = language === 'fr';

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/courses/${id}`)
      .then(res => { if (!res.ok) throw new Error('Parcours introuvable.'); return res.json(); })
      .then(data => setCourse(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/exercises/course/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(res => res.ok ? res.json() : [])
      .then(setExercises)
      .catch(() => setExercises([]));
  }, [id, token]);

  if (loading) return <div className="min-h-screen text-white"><Navbar /><p className="text-muted text-sm text-center py-32">{fr ? 'Chargement...' : 'Loading...'}</p></div>;

  if (error || !course) {
    return (
      <div className="min-h-screen text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p className="text-muted text-sm">{error || (fr ? 'Parcours introuvable.' : 'Course not found.')}</p>
          <Link to="/catalog" className="text-primary-light hover:text-white font-semibold text-sm">{fr ? '← Retour au catalogue' : '← Back to catalog'}</Link>
        </div>
      </div>
    );
  }

  const totalDuration = course.lessons.reduce((acc, l) => {
    const [min, sec] = l.duration.split(':').map(Number);
    return acc + min * 60 + (sec || 0);
  }, 0);
  const totalHours = Math.floor(totalDuration / 3600);
  const totalMinutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 text-xs text-muted mb-6">
          <Link to="/catalog" className="hover:text-slate-300 transition-colors">{DOMAIN_LABELS[course.domain]?.[language] || (fr ? 'Parcours' : 'Course')}</Link>
          <span>›</span>
          <span className="text-slate-300">{t(course, 'title_fr', 'title_en')}</span>
        </div>

        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 border border-white/10">
          <img src={course.thumbnail_url || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200'} alt={t(course, 'title_fr', 'title_en')} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-transparent"></div>
          {course.is_bestseller && <span className="absolute top-4 left-4 bg-amber-400 text-slate-900 text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded">{fr ? 'Meilleure vente' : 'Bestseller'}</span>}
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-primary/10 text-primary-light border border-primary/20">
            {DOMAIN_LABELS[course.domain]?.[language] || course.domain}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-white/5 text-muted border border-white/10">
            {LEVEL_LABELS[course.level]?.[language] || course.level}
          </span>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold mb-3 leading-tight tracking-tight">{t(course, 'title_fr', 'title_en')}</h1>
        <p className="text-slate-400 text-sm mb-4 max-w-2xl leading-relaxed">{t(course, 'description_fr', 'description_en')}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-8">
          {course.instructor_name && <span>{fr ? 'Créé par' : 'Created by'} <span className="text-primary-light font-semibold">{course.instructor_name}</span></span>}
          {course.students_count > 0 && <span>{course.students_count} {fr ? 'participants' : 'students'}</span>}
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-bold uppercase text-muted tracking-wide mb-4">{fr ? 'Ce parcours comprend' : 'This course includes'}</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-3"><Video size={18} className="text-primary-light shrink-0" /> {totalHours}h{totalMinutes.toString().padStart(2, '0')} {fr ? 'de vidéo à la demande' : 'on-demand video'}</div>
            <div className="flex items-center gap-3"><FileText size={18} className="text-primary-light shrink-0" /> {fr ? 'Ressources téléchargeables' : 'Downloadable resources'}</div>
            <div className="flex items-center gap-3"><Smartphone size={18} className="text-primary-light shrink-0" /> {fr ? 'Accès sur mobile et ordinateur' : 'Access on mobile and desktop'}</div>
            <div className="flex items-center gap-3"><Infinity size={18} className="text-primary-light shrink-0" /> {fr ? 'Accès illimité à vie' : 'Full lifetime access'}</div>
            <div className="flex items-center gap-3"><Award size={18} className="text-primary-light shrink-0" /> {fr ? 'Certificat de fin de parcours' : 'Certificate of completion'}</div>
          </div>
        </div>

        <div className="space-y-2 mb-10">
          <h3 className="text-xs font-semibold uppercase text-muted tracking-wide mb-3">{fr ? 'Programme du parcours' : 'Course curriculum'}</h3>
          {course.lessons.map(lesson => (
            <div key={lesson.id} className="flex justify-between items-center bg-surface border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors">
              <span className="text-sm text-slate-200">{t(lesson, 'title_fr', 'title_en')}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted">{lesson.duration}</span>
                {course.is_free ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Lock size={16} className="text-muted" />}
              </div>
            </div>
          ))}
        </div>

        {exercises.length > 0 && (
          <div className="space-y-4 mb-10">
            <h3 className="text-xs font-semibold uppercase text-muted tracking-wide">
              {fr ? 'Exercices pratiques' : 'Practical exercises'}
            </h3>
            {exercises.map(ex => <ExerciseBlock key={ex.id} exercise={ex} />)}
          </div>
        )}

        {token && (course.is_free || exercises.length > 0) && (
          <div className="mb-10">
            <SubmissionBlock courseId={course.id} domain={course.domain} />
          </div>
        )}

        <div className="flex items-center justify-between bg-surface border border-white/10 rounded-2xl p-6">
          <div>
            <span className="text-[11px] text-muted uppercase tracking-wide block mb-1">{fr ? 'Tarif' : 'Price'}</span>
            <span className="font-display text-xl font-bold text-primary-light">{course.is_free ? (fr ? 'Gratuit' : 'Free') : `$${course.price}`}</span>
          </div>
          <button onClick={() => setSelectedCourse(course)} className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] text-white font-semibold px-8 py-3 rounded-lg text-sm transition-shadow">
            {course.is_free ? (fr ? 'Accéder au parcours' : 'Access course') : (fr ? "Débloquer l'accès à vie" : 'Unlock lifetime access')}
          </button>
        </div>
      </section>
      {selectedCourse && <PaymentModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
    </div>
  );
};
export default CourseDetails;