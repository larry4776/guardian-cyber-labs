import React, { useState, useEffect, useContext } from 'react';
import AdminLayout from './AdminLayout';
import ExerciseManager from '../../components/ExerciseManager';
import { AuthContext } from '../../context/AuthContext';
import { API_URL } from '../../config';

const DOMAINS = [
  { key: 'red_team', label: 'Red Team' },
  { key: 'blue_team', label: 'Blue Team' },
  { key: 'grc', label: 'GRC' },
];
const LEVELS = [
  { key: 'beginner', label: 'Débutant' },
  { key: 'intermediate', label: 'Intermédiaire' },
  { key: 'advanced', label: 'Avancé' },
];
const EMPTY_COURSE = {
  title_fr: '', title_en: '', description_fr: '', description_en: '', price: 0, is_free: false,
  domain: '', level: '', status: 'draft', thumbnail_url: '', instructor_name: '', instructor_avatar: '',
  lessons: [], rating: 0, reviews_count: 0, students_count: 0, is_bestseller: false,
};

const AdminCourses = () => {
  const { token } = useContext(AuthContext);
  const authHeaders = { Authorization: `Bearer ${token}` };
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('new');
  const [courseToEdit, setCourseToEdit] = useState(EMPTY_COURSE);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(null);
  const [uploadingVideoEn, setUploadingVideoEn] = useState(null);

  const loadCourses = async () => {
    const res = await fetch(`${API_URL}/courses/all`, { headers: authHeaders });
    const data = res.ok ? await res.json() : [];
    setCourses(data);
    return data;
  };

  useEffect(() => { loadCourses(); }, []);

  const handleCourseSelect = (value) => {
    setSelectedCourseId(value);
    if (value === 'new') {
      setCourseToEdit(EMPTY_COURSE);
    } else {
      const c = courses.find(c => c.id === parseInt(value));
      if (c) setCourseToEdit(c);
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingThumb(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/uploads/image`, { method: 'POST', headers: authHeaders, body: formData });
      const data = await res.json();
      setCourseToEdit({ ...courseToEdit, thumbnail_url: `${API_URL}${data.url}` });
    } catch { alert("Échec de l'import de l'image."); }
    finally { setUploadingThumb(false); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/uploads/image`, { method: 'POST', headers: authHeaders, body: formData });
      const data = await res.json();
      setCourseToEdit({ ...courseToEdit, instructor_avatar: `${API_URL}${data.url}` });
    } catch { alert("Échec de l'import de l'avatar."); }
  };

  const handleVideoUpload = async (lessonId, file, lang = 'fr') => {
    if (!file) return;
    if (lang === 'fr') setUploadingVideo(lessonId);
    else setUploadingVideoEn(lessonId);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/uploads/video`, { method: 'POST', headers: authHeaders, body: formData });
      const data = await res.json();
      const field = lang === 'fr' ? 'video_url' : 'video_url_en';
      updateLesson(lessonId, field, `${API_URL}${data.url}`);
    } catch { alert("Échec de l'import de la vidéo."); }
    finally {
      if (lang === 'fr') setUploadingVideo(null);
      else setUploadingVideoEn(null);
    }
  };

  const addLesson = () => {
    const uniqueId = `new-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setCourseToEdit({
      ...courseToEdit,
      lessons: [...(courseToEdit.lessons || []), {
        id: uniqueId, title_fr: '', title_en: '', duration: '00:00', video_url: '', video_url_en: ''
      }]
    });
  };

  const updateLesson = (lessonId, field, value) => {
    setCourseToEdit({
      ...courseToEdit,
      lessons: courseToEdit.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l)
    });
  };

  const removeLesson = async (lessonId) => {
    if (typeof lessonId === 'number' && selectedCourseId !== 'new') {
      await fetch(`${API_URL}/courses/${selectedCourseId}/lessons/${lessonId}`, { method: 'DELETE', headers: authHeaders });
    }
    setCourseToEdit({ ...courseToEdit, lessons: courseToEdit.lessons.filter(l => l.id !== lessonId) });
  };

  const saveCourse = async (status) => {
    setIsSaving(true);
    setSaveMessage('');
    const payload = {
      title_fr: courseToEdit.title_fr, title_en: courseToEdit.title_en,
      description_fr: courseToEdit.description_fr, description_en: courseToEdit.description_en,
      price: parseInt(courseToEdit.price) || 0, is_free: courseToEdit.is_free,
      domain: courseToEdit.domain, level: courseToEdit.level, status,
      thumbnail_url: courseToEdit.thumbnail_url, instructor_name: courseToEdit.instructor_name,
      instructor_avatar: courseToEdit.instructor_avatar || '',
      rating: courseToEdit.rating || 0, reviews_count: courseToEdit.reviews_count || 0,
      students_count: courseToEdit.students_count || 0, is_bestseller: courseToEdit.is_bestseller || false,
    };
    try {
      let savedCourse;
      if (selectedCourseId === 'new') {
        const res = await fetch(`${API_URL}/courses/`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders }, body: JSON.stringify(payload) });
        savedCourse = await res.json();
      } else {
        const res = await fetch(`${API_URL}/courses/${selectedCourseId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders }, body: JSON.stringify(payload) });
        savedCourse = await res.json();
      }
      for (const lesson of courseToEdit.lessons || []) {
        if (typeof lesson.id === 'string' && lesson.id.startsWith('new-')) {
          await fetch(`${API_URL}/courses/${savedCourse.id}/lessons`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify({
              title_fr: lesson.title_fr, title_en: lesson.title_en,
              duration: lesson.duration, video_url: lesson.video_url,
              video_url_en: lesson.video_url_en || '', order: 0
            }),
          });
        } else if (typeof lesson.id === 'number') {
          await fetch(`${API_URL}/courses/${savedCourse.id}/lessons/${lesson.id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify({
              title_fr: lesson.title_fr, title_en: lesson.title_en,
              duration: lesson.duration, video_url: lesson.video_url,
              video_url_en: lesson.video_url_en || '', order: lesson.order || 0
            }),
          });
        }
      }
      const freshCourses = await loadCourses();
      const freshCourse = freshCourses.find(c => c.id === savedCourse.id);
      setSaveMessage(status === 'published' ? '✓ Parcours publié.' : '✓ Brouillon enregistré.');
      setSelectedCourseId(savedCourse.id.toString());
      if (freshCourse) setCourseToEdit(freshCourse);
      setTimeout(() => setSaveMessage(''), 3000);
    } catch { setSaveMessage('Erreur lors de la sauvegarde.'); }
    finally { setIsSaving(false); }
  };

  const deleteCourse = async () => {
    if (selectedCourseId === 'new') return;
    if (!window.confirm(`Supprimer définitivement "${courseToEdit.title_fr}" ?`)) return;
    await fetch(`${API_URL}/courses/${selectedCourseId}`, { method: 'DELETE', headers: authHeaders });
    loadCourses();
    setSelectedCourseId('new');
    setCourseToEdit(EMPTY_COURSE);
  };

  return (
    <AdminLayout title="Gestion des parcours">
      <div className="space-y-6">

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <select value={selectedCourseId} onChange={(e) => handleCourseSelect(e.target.value)}
            className="bg-white/[0.03] border border-white/10 text-white text-sm px-4 py-2.5 rounded-lg outline-none">
            <option value="new">+ Nouveau parcours</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title_fr} {c.status === 'draft' ? '(brouillon)' : ''}</option>)}
          </select>
          <div className="flex items-center gap-3">
            {selectedCourseId !== 'new' && (
              <>
                <span className={`text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full ${courseToEdit.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {courseToEdit.status === 'published' ? 'Publié' : 'Brouillon'}
                </span>
                <button onClick={deleteCourse} className="text-red-400 hover:text-red-300 text-xs font-semibold uppercase">Supprimer</button>
              </>
            )}
          </div>
        </div>

        {saveMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg px-4 py-3">{saveMessage}</div>
        )}

        {/* Informations générales */}
        <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-white border-b border-white/10 pb-4">Informations générales</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Titre (Français)" value={courseToEdit.title_fr || ''}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, title_fr: e.target.value })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50" />
            <input type="text" placeholder="Title (English)" value={courseToEdit.title_en || ''}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, title_en: e.target.value })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <textarea placeholder="Description (Français)" rows="3" value={courseToEdit.description_fr || ''}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, description_fr: e.target.value })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50 resize-none" />
            <textarea placeholder="Description (English)" rows="3" value={courseToEdit.description_en || ''}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, description_en: e.target.value })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50 resize-none" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <select value={courseToEdit.domain || ''} onChange={(e) => setCourseToEdit({ ...courseToEdit, domain: e.target.value })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none">
              <option value="">Choisir un domaine</option>
              {DOMAINS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
            </select>
            <select value={courseToEdit.level || ''} onChange={(e) => setCourseToEdit({ ...courseToEdit, level: e.target.value })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none">
              <option value="">Choisir un niveau</option>
              {LEVELS.map(l => <option key={l.key} value={l.key}>{l.label}</option>)}
            </select>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <label className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white cursor-pointer">
              <input type="checkbox" checked={courseToEdit.is_free || false} onChange={(e) => setCourseToEdit({ ...courseToEdit, is_free: e.target.checked })} className="accent-primary" />
              Parcours gratuit
            </label>
            {!courseToEdit.is_free && (
              <input type="number" placeholder="Prix (FCFA)" value={courseToEdit.price || ''}
                onChange={(e) => setCourseToEdit({ ...courseToEdit, price: e.target.value })}
                className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50" />
            )}
            <label className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white cursor-pointer">
              <input type="checkbox" checked={courseToEdit.is_bestseller || false} onChange={(e) => setCourseToEdit({ ...courseToEdit, is_bestseller: e.target.checked })} className="accent-amber-400" />
              Meilleure vente
            </label>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <input type="number" step="0.1" min="0" max="5" placeholder="Note (ex: 4.7)"
              value={courseToEdit.rating ? (courseToEdit.rating / 10).toFixed(1) : ''}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, rating: Math.round(parseFloat(e.target.value || 0) * 10) })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50" />
            <input type="number" placeholder="Nombre d'avis" value={courseToEdit.reviews_count || ''}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, reviews_count: parseInt(e.target.value) || 0 })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50" />
            <input type="number" placeholder="Nombre d'étudiants" value={courseToEdit.students_count || ''}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, students_count: parseInt(e.target.value) || 0 })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50" />
          </div>
        </div>

        {/* Formateur */}
        <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-white/10 pb-4">Formateur</h3>
          <input type="text" placeholder="Nom du formateur" value={courseToEdit.instructor_name || ''}
            onChange={(e) => setCourseToEdit({ ...courseToEdit, instructor_name: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50" />
          <div className="flex items-center gap-4">
            {courseToEdit.instructor_avatar ? (
              <img src={courseToEdit.instructor_avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-primary/30" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light text-lg font-bold">
                {courseToEdit.instructor_name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <label className="bg-white/[0.03] border border-white/10 hover:border-primary/40 text-slate-300 hover:text-primary-light px-4 py-2.5 rounded-lg text-xs font-semibold uppercase cursor-pointer transition-colors">
              {courseToEdit.instructor_avatar ? '✓ Avatar importé' : 'Choisir un avatar'}
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
            {courseToEdit.instructor_avatar && (
              <button onClick={() => setCourseToEdit({ ...courseToEdit, instructor_avatar: '' })} className="text-red-400 hover:text-red-300 text-xs font-semibold">Supprimer</button>
            )}
          </div>
        </div>

        {/* Image de couverture */}
        <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-white/10 pb-4">Image de couverture</h3>
          <div className="flex items-center gap-4">
            {courseToEdit.thumbnail_url && (
              <img src={courseToEdit.thumbnail_url} alt="" className="w-24 h-16 object-cover rounded-lg border border-white/10" />
            )}
            <label className="bg-white/[0.03] border border-white/10 hover:border-primary/40 text-slate-300 hover:text-primary-light px-4 py-2.5 rounded-lg text-xs font-semibold uppercase cursor-pointer transition-colors">
              {uploadingThumb ? 'Import en cours...' : 'Choisir une image'}
              <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" disabled={uploadingThumb} />
            </label>
          </div>
        </div>

        {/* Programme des leçons */}
        <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h3 className="text-sm font-bold text-white">Programme ({(courseToEdit.lessons || []).length} leçons)</h3>
            <button onClick={addLesson} className="text-xs text-primary-light hover:text-white font-semibold">+ Ajouter une leçon</button>
          </div>
          {(courseToEdit.lessons || []).map((lesson) => (
            <div key={lesson.id} className="bg-white/[0.03] p-4 rounded-lg border border-white/10 space-y-3">
              {/* Titres */}
              <div className="grid md:grid-cols-2 gap-3">
                <input className="bg-white/[0.03] border border-white/10 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-primary/50"
                  value={lesson.title_fr || ''} onChange={(e) => updateLesson(lesson.id, 'title_fr', e.target.value)} placeholder="Titre de la leçon (FR)" />
                <input className="bg-white/[0.03] border border-white/10 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-primary/50"
                  value={lesson.title_en || ''} onChange={(e) => updateLesson(lesson.id, 'title_en', e.target.value)} placeholder="Lesson title (EN)" />
              </div>

              {/* Durée */}
              <input className="w-full bg-white/[0.03] border border-white/10 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-primary/50"
                value={lesson.duration} onChange={(e) => updateLesson(lesson.id, 'duration', e.target.value)} placeholder="Durée (ex: 12:30)" />

              {/* Vidéos FR + EN */}
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Vidéo — Français</p>
                  <div className="flex items-center gap-2">
                    {lesson.video_url && <span className="text-[10px] text-emerald-400 font-semibold">✓ Importée</span>}
                    <label className="bg-white/[0.03] border border-white/10 hover:border-primary/40 text-slate-300 hover:text-primary-light px-3 py-2 rounded-lg text-[10px] font-semibold uppercase cursor-pointer transition-colors">
                      {uploadingVideo === lesson.id ? 'Import...' : lesson.video_url ? 'Changer' : 'Choisir'}
                      <input type="file" accept="video/*" onChange={(e) => handleVideoUpload(lesson.id, e.target.files[0], 'fr')} className="hidden" disabled={uploadingVideo === lesson.id} />
                    </label>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Vidéo — English</p>
                  <div className="flex items-center gap-2">
                    {lesson.video_url_en && <span className="text-[10px] text-emerald-400 font-semibold">✓ Imported</span>}
                    <label className="bg-white/[0.03] border border-blue-500/20 hover:border-blue-500/40 text-slate-300 hover:text-blue-400 px-3 py-2 rounded-lg text-[10px] font-semibold uppercase cursor-pointer transition-colors">
                      {uploadingVideoEn === lesson.id ? 'Import...' : lesson.video_url_en ? 'Change' : 'Choose'}
                      <input type="file" accept="video/*" onChange={(e) => handleVideoUpload(lesson.id, e.target.files[0], 'en')} className="hidden" disabled={uploadingVideoEn === lesson.id} />
                    </label>
                  </div>
                </div>
              </div>

              <button onClick={() => removeLesson(lesson.id)} className="text-red-400 hover:text-red-300 text-xs font-bold">✕ Supprimer cette leçon</button>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => saveCourse('draft')} disabled={isSaving} className="border border-white/10 hover:border-white/30 text-slate-300 hover:text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
            Enregistrer comme brouillon
          </button>
          <button onClick={() => saveCourse('published')} disabled={isSaving} className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-shadow">
            {isSaving ? 'Publication...' : 'Publier'}
          </button>
        </div>

        {selectedCourseId !== 'new' && (
          <ExerciseManager courseId={selectedCourseId} authHeaders={authHeaders} />
        )}
      </div>
    </AdminLayout>
  );
};
export default AdminCourses;