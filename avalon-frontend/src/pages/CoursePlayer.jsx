import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, PlayCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import ExerciseBlock from '../components/ExerciseBlock';
import SubmissionBlock from '../components/SubmissionBlock';
import Navbar from '../components/Navbar';
import { API_URL } from '../config';

const CoursePlayer = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const { language, t } = useContext(LanguageContext);
  const fr = language === 'fr';
  const [course, setCourse] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedIds, setCompletedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exercises, setExercises] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/courses/${id}`)
      .then(res => { if (!res.ok) throw new Error('Cours introuvable.'); return res.json(); })
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

  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.load();
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [activeLessonIndex, course, language]);

  const markLessonComplete = async (lessonId) => {
    if (!token) return;
    setCompletedIds((prev) => [...new Set([...prev, lessonId])]);
    try {
      await fetch(`${API_URL}/courses/${id}/progress/${lessonId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
  };

  const goToNextLesson = () => {
    if (!course) return;
    const current = course.lessons[activeLessonIndex];
    if (current) markLessonComplete(current.id);
    if (activeLessonIndex < course.lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    }
  };

  // Choisit automatiquement la bonne vidéo selon la langue
  const getVideoUrl = (lesson) => {
    if (language === 'en' && lesson.video_url_en && lesson.video_url_en.trim() !== '') {
      return lesson.video_url_en;
    }
    return lesson.video_url || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white">
        <Navbar />
        <p className="text-muted text-sm text-center py-32">{fr ? 'Chargement...' : 'Loading...'}</p>
      </div>
    );
  }

  if (error || !course || course.lessons.length === 0) {
    return (
      <div className="min-h-screen text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p className="text-muted text-sm">{error || (fr ? 'Aucune leçon disponible pour ce parcours.' : 'No lesson available for this course.')}</p>
          <Link to="/dashboard" className="text-primary-light hover:text-white font-semibold text-sm">{fr ? '← Retour à mon apprentissage' : '← Back to my learning'}</Link>
        </div>
      </div>
    );
  }

  const activeLesson = course.lessons[activeLessonIndex];
  const activeVideoUrl = getVideoUrl(activeLesson);
  const hasResume = course.resume_pdf_url && course.resume_pdf_url.trim() !== '';
  const hasTp = course.tp_pdf_url && course.tp_pdf_url.trim() !== '';
  const isLast = activeLessonIndex === course.lessons.length - 1;

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 text-xs text-muted mb-6">
          <Link to="/dashboard" className="hover:text-slate-300 transition-colors">{fr ? 'Mon apprentissage' : 'My learning'}</Link>
          <span>›</span>
          <span className="text-slate-300">{t(course, 'title_fr', 'title_en')}</span>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-[320px_1fr]">

            {/* Programme à gauche */}
            <div className="border-b lg:border-b-0 lg:border-r border-white/10 max-h-[280px] lg:max-h-[520px] overflow-y-auto">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 sticky top-0 bg-surface/95 backdrop-blur-sm">
                <h3 className="text-xs font-bold uppercase text-muted tracking-wide">{fr ? 'Programme du parcours' : 'Course curriculum'}</h3>
                <span className="text-[11px] text-muted">{completedIds.length}/{course.lessons.length}</span>
              </div>
              <div className="p-2">
                {course.lessons.map((lesson, index) => {
                  const isActive = index === activeLessonIndex;
                  const isDone = completedIds.includes(lesson.id);
                  const videoAvailable = getVideoUrl(lesson);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLessonIndex(index)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-colors ${
                        isActive ? 'bg-primary/10 border border-primary/30 text-primary-light' : 'border border-transparent text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span className="shrink-0">
                        {isDone ? (
                          <CheckCircle2 size={18} className="text-emerald-400" />
                        ) : (
                          <PlayCircle size={18} className={isActive ? 'text-primary-light' : 'text-slate-600'} />
                        )}
                      </span>
                      <span className="flex-1 leading-snug">{t(lesson, 'title_fr', 'title_en')}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        {!videoAvailable && (
                          <span className="text-[9px] font-bold uppercase text-amber-500/70 bg-amber-500/10 px-1.5 py-0.5 rounded">
                            {fr ? 'Bientôt' : 'Soon'}
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-muted">{lesson.duration}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lecteur à droite */}
            <div>
              <div className="bg-black aspect-video flex items-center justify-center relative">
                {activeVideoUrl ? (
                  <video ref={videoRef} key={`${activeLesson.id}-${language}`} controls autoPlay className="w-full h-full">
                    <source src={activeVideoUrl} />
                    {fr ? 'Ton navigateur ne supporte pas la lecture vidéo.' : "Your browser doesn't support video playback."}
                  </video>
                ) : (
                  <div className="text-center px-8">
                    <p className="text-muted text-sm mb-2">
                      {fr ? "Aucune vidéo disponible pour cette leçon" : 'No video available for this lesson'}
                      {language === 'en' && activeLesson.video_url ? (
                        <span className="block text-xs text-slate-600 mt-1">
                          {fr ? '(Vidéo en français disponible)' : '(French video available)'}
                        </span>
                      ) : null}
                    </p>
                  </div>
                )}

                {/* Indicateur de langue de la vidéo */}
                {activeVideoUrl && (
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                      language === 'en' && activeLesson.video_url_en
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-white/10 text-slate-400 border border-white/10'
                    }`}>
                      {language === 'en' && activeLesson.video_url_en ? 'EN' : 'FR'}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <span className="text-[11px] font-semibold text-primary-light uppercase tracking-wide">{t(course, 'title_fr', 'title_en')}</span>
                    <h1 className="font-display text-xl font-bold mt-1">{t(activeLesson, 'title_fr', 'title_en')}</h1>

                    {/* Info vidéo disponible dans l'autre langue */}
                    {language === 'en' && !activeLesson.video_url_en && activeLesson.video_url && (
                      <p className="text-xs text-amber-400/70 mt-1">
                        Video available in French only for this lesson.
                      </p>
                    )}
                    {language === 'fr' && !activeLesson.video_url && activeLesson.video_url_en && (
                      <p className="text-xs text-amber-400/70 mt-1">
                        Vidéo disponible uniquement en anglais pour cette leçon.
                      </p>
                    )}
                  </div>
                  {!isLast ? (
                    <button onClick={goToNextLesson} className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-shadow whitespace-nowrap shrink-0">
                      {fr ? 'Leçon suivante →' : 'Next lesson →'}
                    </button>
                  ) : (
                    <button onClick={() => markLessonComplete(activeLesson.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap shrink-0">
                      {fr ? 'Marquer comme terminé' : 'Mark as complete'}
                    </button>
                  )}
                </div>

                {(hasResume || hasTp) && (
                  <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    {hasResume && (
                      <a href={course.resume_pdf_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between bg-white/[0.02] border border-white/10 rounded-xl p-4 hover:border-primary/40 transition-colors">
                        <span className="text-sm font-semibold text-slate-200">{fr ? 'Fiche Synthèse' : 'Summary sheet'}</span>
                        <span className="text-xs font-bold uppercase text-primary-light bg-primary/10 px-3 py-1.5 rounded-lg">{fr ? 'Télécharger' : 'Download'}</span>
                      </a>
                    )}
                    {hasTp && (
                      <a href={course.tp_pdf_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between bg-white/[0.02] border border-white/10 rounded-xl p-4 hover:border-primary/40 transition-colors">
                        <span className="text-sm font-semibold text-slate-200">{fr ? 'Travaux Pratiques' : 'Practical work'}</span>
                        <span className="text-xs font-bold uppercase text-primary-light bg-primary/10 px-3 py-1.5 rounded-lg">{fr ? 'Télécharger' : 'Download'}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {exercises.length > 0 && (
          <div className="space-y-4 mt-10">
            <h3 className="text-xs font-semibold uppercase text-muted tracking-wide">
              {fr ? 'Exercices pratiques' : 'Practical exercises'}
            </h3>
            {exercises.map(ex => <ExerciseBlock key={ex.id} exercise={ex} />)}
          </div>
        )}

        {token && (course.is_free || exercises.length > 0) && (
          <div className="mt-10">
            <SubmissionBlock courseId={course.id} domain={course.domain} />
          </div>
        )}
      </div>
    </div>
  );
};
export default CoursePlayer;