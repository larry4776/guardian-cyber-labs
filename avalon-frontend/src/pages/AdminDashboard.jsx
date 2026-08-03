import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ExerciseManager from '../components/ExerciseManager';
import SubmissionsGrading from '../components/SubmissionsGrading';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

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
  title_fr: '', title_en: '', description_fr: '', description_en: '', price: 0, is_free: false, domain: '', level: '',
  status: 'draft', thumbnail_url: '', instructor_name: '', lessons: [],
  rating: 0, reviews_count: 0, students_count: 0, is_bestseller: false
};

const PaymentSettingsSection = ({ authHeaders }) => {
  const [methods, setMethods] = useState([]);
  const [uploading, setUploading] = useState(null);
  const [saveMsg, setSaveMsg] = useState('');

  const load = () => {
    fetch(`${API_URL}/payment-methods/all`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : [])
      .then(setMethods);
  };

  useEffect(() => { load(); }, []);

  const updateField = (key, field, value) => {
    setMethods(methods.map(m => m.key === key ? { ...m, [field]: value } : m));
  };

  const handleLogoUpload = async (key, file) => {
    if (!file) return;
    setUploading(key);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/uploads/image`, {
        method: 'POST',
        headers: authHeaders,
        body: formData,
      });
      const data = await res.json();
      updateField(key, 'logo_url', `${API_URL}${data.url}`);
    } catch {
      alert("Échec de l'import du logo.");
    } finally {
      setUploading(null);
    }
  };

  const saveMethod = async (m) => {
    await fetch(`${API_URL}/payment-methods/${m.key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({
        display_name: m.display_name,
        logo_url: m.logo_url,
        receiving_info: m.receiving_info,
        enabled: m.enabled,
      }),
    });
    setSaveMsg(`✓ ${m.display_name} enregistré.`);
    setTimeout(() => setSaveMsg(''), 2500);
  };

  return (
    <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-6">
      <h3 className="text-sm font-bold text-white">Réglages des moyens de paiement</h3>
      {saveMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg px-4 py-3">{saveMsg}</div>
      )}
      <div className="space-y-4">
        {methods.map((m) => (
          <div key={m.key} className="bg-white/[0.03] border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">{m.key}</span>
              <label className="flex items-center gap-2 text-xs text-slate-400">
                <input type="checkbox" checked={m.enabled} onChange={(e) => updateField(m.key, 'enabled', e.target.checked)} className="accent-primary" />
                Actif
              </label>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <input
                type="text" placeholder="Nom affiché" value={m.display_name}
                onChange={(e) => updateField(m.key, 'display_name', e.target.value)}
                className="bg-white/[0.03] border border-white/10 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-primary/50"
              />
              <input
                type="text" placeholder="Infos de réception (numéro, email, ID marchand...)" value={m.receiving_info || ''}
                onChange={(e) => updateField(m.key, 'receiving_info', e.target.value)}
                className="bg-white/[0.03] border border-white/10 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-primary/50"
              />
            </div>
            <div className="flex items-center gap-3">
              {m.logo_url && <img src={m.logo_url} alt="" className="h-8 object-contain bg-white/5 rounded px-2 py-1" />}
              <label className="bg-white/[0.03] border border-white/10 hover:border-primary/40 text-slate-300 hover:text-primary-light px-3 py-2 rounded-lg text-[10px] font-semibold uppercase cursor-pointer transition-colors">
                {uploading === m.key ? 'Import...' : 'Choisir un logo'}
                <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(m.key, e.target.files[0])} className="hidden" disabled={uploading === m.key} />
              </label>
              <button onClick={() => saveMethod(m)} className="ml-auto bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                Enregistrer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserManagementSection = ({ authHeaders, currentUserEmail }) => {
  const [users, setUsers] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ email: '', password: '', first_name: '' });
  const [msg, setMsg] = useState('');

  const loadUsers = () => {
    fetch(`${API_URL}/admin/users`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : [])
      .then(setUsers);
  };

  useEffect(() => { loadUsers(); }, []);

  const changeRole = async (userId, newRole) => {
    await fetch(`${API_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ role: newRole }),
    });
    loadUsers();
  };

  const deleteUser = async (userId, email) => {
    if (email === currentUserEmail) {
      alert("Tu ne peux pas supprimer ton propre compte.");
      return;
    }
    if (!window.confirm(`Supprimer définitivement le compte de ${email} ?`)) return;
    await fetch(`${API_URL}/admin/users/${userId}`, { method: 'DELETE', headers: authHeaders });
    loadUsers();
  };

  const createAdmin = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(newAdmin),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Erreur lors de la création.');
      }
      setMsg('✓ Nouvel administrateur créé.');
      setNewAdmin({ email: '', password: '', first_name: '' });
      loadUsers();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.message);
    }
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-6">
      <h3 className="text-sm font-bold text-white">Gestion des utilisateurs</h3>

      {msg && (
        <div className={`text-sm rounded-lg px-4 py-3 ${msg.startsWith('✓') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {msg}
        </div>
      )}

      <form onSubmit={createAdmin} className="bg-white/[0.03] border border-white/10 rounded-lg p-4 space-y-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ajouter un administrateur</span>
        <div className="grid md:grid-cols-3 gap-3">
          <input
            type="text" placeholder="Prénom" value={newAdmin.first_name}
            onChange={(e) => setNewAdmin({ ...newAdmin, first_name: e.target.value })}
            className="bg-white/[0.03] border border-white/10 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-primary/50"
          />
          <input
            type="email" placeholder="Email" required value={newAdmin.email}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
            className="bg-white/[0.03] border border-white/10 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-primary/50"
          />
          <input
            type="password" placeholder="Mot de passe" required value={newAdmin.password}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
            className="bg-white/[0.03] border border-white/10 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-primary/50"
          />
        </div>
        <button type="submit" className="bg-gradient-to-r from-primary to-primary-dark text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
          Créer l'administrateur
        </button>
      </form>

      <table className="w-full text-xs text-left">
        <thead className="bg-white/[0.03] text-slate-500 uppercase">
          <tr>
            <th className="p-3">Nom</th>
            <th className="p-3">Email</th>
            <th className="p-3">Rôle</th>
            <th className="p-3">Inscrit le</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map(u => (
            <tr key={u.id}>
              <td className="p-3 text-slate-300">{u.first_name || '—'} {u.last_name || ''}</td>
              <td className="p-3 text-slate-400">{u.email}</td>
              <td className="p-3">
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                  className="bg-white/[0.03] border border-white/10 text-white text-[11px] px-2 py-1 rounded outline-none"
                >
                  <option value="student">student</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td className="p-3 text-slate-500">{formatDate(u.created_at)}</td>
              <td className="p-3">
                <button onClick={() => deleteUser(u.id, u.email)} className="text-red-400 hover:text-red-300 font-semibold uppercase text-[11px]">
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminDashboard = () => {
  const { token, loading, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const authHeaders = { Authorization: `Bearer ${token}` };

  const [summary, setSummary] = useState(null);
  const [messages, setMessages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('new');
  const [courseToEdit, setCourseToEdit] = useState(EMPTY_COURSE);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(null);

  useEffect(() => {
    if (!loading && !token) navigate('/login');
  }, [token, loading]);

  const loadCourses = async () => {
    const res = await fetch(`${API_URL}/courses/all`, { headers: authHeaders });
    const data = res.ok ? await res.json() : [];
    setCourses(data);
    return data;
  };

  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/payments/admin/summary`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : null)
      .then(setSummary);

    fetch(`${API_URL}/contact/`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : [])
      .then(setMessages);

    fetch(`${API_URL}/admin/transactions`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : [])
      .then(setTransactions);

    loadCourses();
  }, [token]);

  const handleCourseSelect = (value) => {
    setSelectedCourseId(value);
    if (value === 'new') {
      setCourseToEdit(EMPTY_COURSE);
    } else {
      const c = courses.find(c => c.id === parseInt(value));
      setCourseToEdit(c);
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingThumb(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/uploads/image`, {
        method: 'POST',
        headers: authHeaders,
        body: formData,
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCourseToEdit({ ...courseToEdit, thumbnail_url: `${API_URL}${data.url}` });
    } catch {
      alert("Échec de l'import de l'image.");
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleVideoUpload = async (lessonId, file) => {
    if (!file) return;
    setUploadingVideo(lessonId);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/uploads/video`, {
        method: 'POST',
        headers: authHeaders,
        body: formData,
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      updateLesson(lessonId, 'video_url', `${API_URL}${data.url}`);
    } catch {
      alert("Échec de l'import de la vidéo.");
    } finally {
      setUploadingVideo(null);
    }
  };

  const addLesson = () => {
    const uniqueId = `new-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setCourseToEdit({
      ...courseToEdit,
      lessons: [...(courseToEdit.lessons || []), { id: uniqueId, title_fr: '', title_en: '', duration: '00:00', video_url: '' }]
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
      await fetch(`${API_URL}/courses/${selectedCourseId}/lessons/${lessonId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
    }
    setCourseToEdit({ ...courseToEdit, lessons: courseToEdit.lessons.filter(l => l.id !== lessonId) });
  };

  const saveCourse = async (status) => {
    setIsSaving(true);
    setSaveMessage('');
    const payload = {
      title_fr: courseToEdit.title_fr,
      title_en: courseToEdit.title_en,
      description_fr: courseToEdit.description_fr,
      description_en: courseToEdit.description_en,
      price: parseInt(courseToEdit.price) || 0,
      is_free: courseToEdit.is_free,
      domain: courseToEdit.domain,
      level: courseToEdit.level,
      status,
      thumbnail_url: courseToEdit.thumbnail_url,
      instructor_name: courseToEdit.instructor_name,
      rating: courseToEdit.rating || 0,
      reviews_count: courseToEdit.reviews_count || 0,
      students_count: courseToEdit.students_count || 0,
      is_bestseller: courseToEdit.is_bestseller || false,
    };

    try {
      let savedCourse;
      if (selectedCourseId === 'new') {
        const res = await fetch(`${API_URL}/courses/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders },
          body: JSON.stringify(payload),
        });
        savedCourse = await res.json();
      } else {
        const res = await fetch(`${API_URL}/courses/${selectedCourseId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...authHeaders },
          body: JSON.stringify(payload),
        });
        savedCourse = await res.json();
      }

      for (const lesson of courseToEdit.lessons || []) {
        if (typeof lesson.id === 'string' && lesson.id.startsWith('new-')) {
          await fetch(`${API_URL}/courses/${savedCourse.id}/lessons`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify({ title_fr: lesson.title_fr, title_en: lesson.title_en, duration: lesson.duration, video_url: lesson.video_url, order: 0 }),
          });
        }
      }

      // Recharge la liste des parcours ET les données fraîches du parcours qu'on vient de sauvegarder,
      // pour que les leçons affichées aient bien leurs vrais identifiants venant du serveur (plus de doublons possibles).
      const freshCourses = await loadCourses();
      const freshCourse = freshCourses.find(c => c.id === savedCourse.id);

      setSaveMessage(status === 'published' ? '✓ Parcours publié.' : '✓ Brouillon enregistré.');
      setSelectedCourseId(savedCourse.id.toString());
      if (freshCourse) setCourseToEdit(freshCourse);
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveMessage('Erreur lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCourse = async () => {
    if (selectedCourseId === 'new') return;
    if (!window.confirm(`Supprimer définitivement "${courseToEdit.title_fr}" ? Cette action est irréversible.`)) return;

    await fetch(`${API_URL}/courses/${selectedCourseId}`, { method: 'DELETE', headers: authHeaders });
    loadCourses();
    setSelectedCourseId('new');
    setCourseToEdit(EMPTY_COURSE);
  };

  const resolveMessage = async (id) => {
    await fetch(`${API_URL}/contact/${id}/resolve`, { method: 'PUT', headers: authHeaders });
    setMessages(messages.map(m => m.id === id ? { ...m, resolved: true } : m));
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading || !token) {
    return <div className="min-h-screen flex items-center justify-center text-muted text-sm">Chargement...</div>;
  }

  return (
    <div className="min-h-screen text-slate-200">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
          <div>
            <span className="text-[11px] font-semibold text-primary-light tracking-wide uppercase">Console de gestion</span>
            <h1 className="font-display text-2xl font-bold text-white mt-1">Panneau d'administration</h1>
          </div>
          {selectedCourseId !== 'new' && (
            <span className={`text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full ${
              courseToEdit.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
            }`}>
              {courseToEdit.status === 'published' ? 'Publié' : 'Brouillon'}
            </span>
          )}
        </div>

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-surface border border-white/10 rounded-2xl p-6">
              <p className="text-[11px] uppercase text-slate-500 font-semibold tracking-wide">Chiffre d'affaires total</p>
              <p className="font-display text-xl font-bold mt-2 text-white">${summary.total_revenue.toLocaleString()}</p>
            </div>
            <div className="bg-surface border border-white/10 rounded-2xl p-6">
              <p className="text-[11px] uppercase text-slate-500 font-semibold tracking-wide">Meilleure vente</p>
              <p className="text-sm mt-2 font-bold text-white">{summary.top_course.title || '—'} · {summary.top_course.sales} ventes</p>
            </div>
            <div className="bg-surface border border-white/10 rounded-2xl p-6">
              <p className="text-[11px] uppercase text-slate-500 font-semibold tracking-wide">Répartition paiement</p>
              <p className="text-sm mt-2 font-bold text-white">
                {Object.entries(summary.payment_breakdown).map(([k, v]) => `${k.toUpperCase()} ${v}`).join(' · ') || 'Aucune vente'}
              </p>
            </div>
          </div>
        )}

        <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="text-sm font-bold text-white">Gestion des parcours</h3>
            <div className="flex items-center gap-3">
              <select
                value={selectedCourseId}
                onChange={(e) => handleCourseSelect(e.target.value)}
                className="bg-white/[0.03] border border-white/10 text-white text-xs px-3 py-2 rounded-lg outline-none"
              >
                <option value="new">+ Nouveau parcours</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title_fr} {c.status === 'draft' ? '(brouillon)' : ''}
                  </option>
                ))}
              </select>
              {selectedCourseId !== 'new' && (
                <button onClick={deleteCourse} className="text-red-400 hover:text-red-300 text-xs font-semibold uppercase">
                  Supprimer
                </button>
              )}
            </div>
          </div>

          {saveMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg px-4 py-3">
              {saveMessage}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text" placeholder="Titre (Français)" value={courseToEdit.title_fr || ''}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, title_fr: e.target.value })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors"
            />
            <input
              type="text" placeholder="Title (English)" value={courseToEdit.title_en || ''}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, title_en: e.target.value })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <textarea
              placeholder="Description (Français)" rows="3" value={courseToEdit.description_fr || ''}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, description_fr: e.target.value })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors resize-none"
            ></textarea>
            <textarea
              placeholder="Description (English)" rows="3" value={courseToEdit.description_en || ''}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, description_en: e.target.value })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors resize-none"
            ></textarea>
          </div>

          <input
            type="text" placeholder="Nom du formateur" value={courseToEdit.instructor_name || ''}
            onChange={(e) => setCourseToEdit({ ...courseToEdit, instructor_name: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <select
              value={courseToEdit.domain || ''}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, domain: e.target.value })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none"
            >
              <option value="">Choisir un domaine</option>
              {DOMAINS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
            </select>
            <select
              value={courseToEdit.level || ''}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, level: e.target.value })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none"
            >
              <option value="">Choisir un niveau</option>
              {LEVELS.map(l => <option key={l.key} value={l.key}>{l.label}</option>)}
            </select>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <label className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white cursor-pointer">
              <input
                type="checkbox" checked={courseToEdit.is_free || false}
                onChange={(e) => setCourseToEdit({ ...courseToEdit, is_free: e.target.checked })}
                className="accent-primary"
              />
              Parcours gratuit
            </label>

            {!courseToEdit.is_free && (
              <input
                type="number" placeholder="Prix ($)" value={courseToEdit.price || ''}
                onChange={(e) => setCourseToEdit({ ...courseToEdit, price: e.target.value })}
                className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors"
              />
            )}

            <label className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white cursor-pointer">
              <input
                type="checkbox" checked={courseToEdit.is_bestseller || false}
                onChange={(e) => setCourseToEdit({ ...courseToEdit, is_bestseller: e.target.checked })}
                className="accent-amber-400"
              />
              Meilleure vente
            </label>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="number" step="0.1" min="0" max="5" placeholder="Note (ex: 4.7)"
              value={courseToEdit.rating ? (courseToEdit.rating / 10).toFixed(1) : ''}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, rating: Math.round(parseFloat(e.target.value || 0) * 10) })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors"
            />
            <input
              type="number" placeholder="Nombre d'avis"
              value={courseToEdit.reviews_count || ''}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, reviews_count: parseInt(e.target.value) || 0 })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors"
            />
            <input
              type="number" placeholder="Nombre d'étudiants"
              value={courseToEdit.students_count || ''}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, students_count: parseInt(e.target.value) || 0 })}
              className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Image de couverture</label>
            <div className="flex items-center gap-4">
              {courseToEdit.thumbnail_url && (
                <img src={courseToEdit.thumbnail_url} alt="" className="w-24 h-16 object-cover rounded-lg border border-white/10" />
              )}
              <label className="bg-white/[0.03] border border-white/10 hover:border-primary/40 text-slate-300 hover:text-primary-light px-4 py-2.5 rounded-lg text-xs font-semibold uppercase cursor-pointer transition-colors">
                {uploadingThumb ? 'Import en cours...' : 'Choisir une image sur mon PC'}
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" disabled={uploadingThumb} />
              </label>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Programme ({(courseToEdit.lessons || []).length} leçons)
              </span>
              <button onClick={addLesson} className="text-xs text-primary-light hover:text-white font-semibold">+ Ajouter une leçon</button>
            </div>
            {(courseToEdit.lessons || []).map((lesson) => (
              <div key={lesson.id} className="bg-white/[0.03] p-4 rounded-lg border border-white/10 space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    className="bg-white/[0.03] border border-white/10 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-primary/50"
                    value={lesson.title_fr || ''} onChange={(e) => updateLesson(lesson.id, 'title_fr', e.target.value)} placeholder="Titre de la leçon (FR)"
                  />
                  <input
                    className="bg-white/[0.03] border border-white/10 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-primary/50"
                    value={lesson.title_en || ''} onChange={(e) => updateLesson(lesson.id, 'title_en', e.target.value)} placeholder="Lesson title (EN)"
                  />
                </div>
                <div className="grid md:grid-cols-12 gap-3 items-center">
                  <input
                    className="md:col-span-8 bg-white/[0.03] border border-white/10 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-primary/50"
                    value={lesson.duration} onChange={(e) => updateLesson(lesson.id, 'duration', e.target.value)} placeholder="00:00"
                  />
                  <label className="md:col-span-3 bg-white/[0.03] border border-white/10 hover:border-primary/40 text-slate-300 hover:text-primary-light px-3 py-2 rounded-lg text-[10px] font-semibold uppercase cursor-pointer text-center transition-colors">
                    {uploadingVideo === lesson.id ? 'Import...' : lesson.video_url ? '✓ Vidéo importée' : 'Choisir une vidéo'}
                    <input type="file" accept="video/*" onChange={(e) => handleVideoUpload(lesson.id, e.target.files[0])} className="hidden" disabled={uploadingVideo === lesson.id} />
                  </label>
                  <button onClick={() => removeLesson(lesson.id)} className="md:col-span-1 text-red-400 hover:text-red-300 text-xs font-bold text-center">✕</button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button onClick={() => saveCourse('draft')} disabled={isSaving} className="border border-white/10 hover:border-white/30 text-slate-300 hover:text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              Enregistrer comme brouillon
            </button>
            <button onClick={() => saveCourse('published')} disabled={isSaving} className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-shadow">
              {isSaving ? 'Publication...' : 'Publier'}
            </button>
          </div>
        </div>

        <ExerciseManager courseId={selectedCourseId} authHeaders={authHeaders} />

        <SubmissionsGrading authHeaders={authHeaders} />

        <PaymentSettingsSection authHeaders={authHeaders} />

        <UserManagementSection authHeaders={authHeaders} currentUserEmail={user?.email} />

        <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Transactions ({transactions.length})</h3>
          </div>
          <table className="w-full text-xs text-left">
            <thead className="bg-white/[0.03] text-slate-500 uppercase">
              <tr><th className="p-4">Étudiant</th><th className="p-4">Parcours</th><th className="p-4">Moyen</th><th className="p-4">Date</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.length > 0 ? transactions.map(t => (
                <tr key={t.id}>
                  <td className="p-4 text-slate-300">{t.user_email}</td>
                  <td className="p-4 text-slate-400">{t.course_title}</td>
                  <td className="p-4 text-primary-light uppercase font-semibold">{t.payment_method || 'Gratuit'}</td>
                  <td className="p-4 text-slate-500">{formatDate(t.created_at)}</td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="p-6 text-center text-slate-600">Aucune transaction pour l'instant.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10"><h3 className="text-sm font-bold text-white">Messages support</h3></div>
          <table className="w-full text-xs text-left">
            <thead className="bg-white/[0.03] text-slate-500 uppercase">
              <tr><th className="p-4">Utilisateur</th><th className="p-4">Message</th><th className="p-4">Statut</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {messages.map(m => (
                <tr key={m.id}>
                  <td className="p-4 text-slate-300">{m.email}</td>
                  <td className="p-4 text-slate-400">{m.subject}</td>
                  <td className="p-4">
                    {m.resolved ? (
                      <span className="text-emerald-400 uppercase text-[11px] font-semibold">Traité</span>
                    ) : (
                      <button onClick={() => resolveMessage(m.id)} className="text-primary-light hover:text-white font-semibold uppercase text-[11px]">Marquer traité</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
export default AdminDashboard;