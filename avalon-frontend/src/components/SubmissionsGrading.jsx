import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const SubmissionsGrading = ({ authHeaders }) => {
  const [submissions, setSubmissions] = useState([]);
  const [gradingId, setGradingId] = useState(null);
  const [gradeForm, setGradeForm] = useState({ status: 'validated', grade: 80, feedback_fr: '', feedback_en: '' });
  const [msg, setMsg] = useState('');

  const load = () => {
    fetch(`${API_URL}/submissions/admin/all`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : [])
      .then(setSubmissions);
  };

  useEffect(() => { load(); }, []);

  const startGrading = (submission) => {
    setGradingId(submission.id);
    setGradeForm({
      status: submission.status === 'pending' ? 'validated' : submission.status,
      grade: submission.grade || 80,
      feedback_fr: submission.feedback_fr || '',
      feedback_en: submission.feedback_en || '',
    });
  };

  const saveGrade = async (id) => {
    setMsg('');
    try {
      const res = await fetch(`${API_URL}/submissions/${id}/grade`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(gradeForm),
      });
      if (!res.ok) throw new Error();
      setMsg('✓ Correction enregistrée.');
      setGradingId(null);
      load();
      setTimeout(() => setMsg(''), 3000);
    } catch {
      setMsg('Erreur lors de la correction.');
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const statusLabel = (status) => {
    if (status === 'validated') return { text: 'Validé', color: 'text-emerald-400 bg-emerald-500/10' };
    if (status === 'needs_review') return { text: 'À revoir', color: 'text-amber-400 bg-amber-500/10' };
    return { text: 'En attente', color: 'text-blue-400 bg-blue-500/10' };
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
      <h3 className="text-sm font-bold text-white">Livrables soumis ({submissions.length})</h3>

      {msg && (
        <div className={`text-sm rounded-lg px-4 py-3 ${msg.startsWith('✓') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {msg}
        </div>
      )}

      {submissions.length === 0 ? (
        <p className="text-slate-500 text-sm">Aucun livrable soumis pour l'instant.</p>
      ) : (
        <div className="space-y-3">
          {submissions.map(s => {
            const badge = statusLabel(s.status);
            return (
              <div key={s.id} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{s.user_email}</p>
                    <p className="text-xs text-slate-500">{s.course_title} — {formatDate(s.submitted_at)}</p>
                  </div>
                  <span className={`text-[11px] font-bold uppercase px-3 py-1 rounded-full ${badge.color}`}>{badge.text}</span>
                </div>

                {s.content_text && (
                  <p className="text-slate-300 text-sm bg-slate-900 rounded-lg p-3 whitespace-pre-wrap">{s.content_text}</p>
                )}
                {s.file_url && (
                  <a href={s.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-xs font-semibold inline-block">
                    📎 Voir le fichier joint
                  </a>
                )}

                {gradingId === s.id ? (
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="grid md:grid-cols-2 gap-3">
                      <select value={gradeForm.status} onChange={(e) => setGradeForm({ ...gradeForm, status: e.target.value })}
                        className="bg-slate-900 border border-slate-800 text-white text-xs px-3 py-2 rounded-lg outline-none">
                        <option value="validated">Valider</option>
                        <option value="needs_review">À revoir</option>
                      </select>
                      <input type="number" min="0" max="100" placeholder="Note /100" value={gradeForm.grade}
                        onChange={(e) => setGradeForm({ ...gradeForm, grade: parseInt(e.target.value) || 0 })}
                        className="bg-slate-900 border border-slate-800 text-white text-xs px-3 py-2 rounded-lg outline-none" />
                    </div>
                    <textarea rows="2" placeholder="Commentaire (FR)" value={gradeForm.feedback_fr}
                      onChange={(e) => setGradeForm({ ...gradeForm, feedback_fr: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 text-white text-xs px-3 py-2 rounded-lg outline-none resize-none" />
                    <textarea rows="2" placeholder="Comment (EN)" value={gradeForm.feedback_en}
                      onChange={(e) => setGradeForm({ ...gradeForm, feedback_en: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 text-white text-xs px-3 py-2 rounded-lg outline-none resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => saveGrade(s.id)} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                        Enregistrer la correction
                      </button>
                      <button onClick={() => setGradingId(null)} className="text-slate-400 hover:text-slate-300 text-xs font-semibold px-4 py-2">
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => startGrading(s)} className="text-blue-400 hover:text-blue-300 text-xs font-semibold uppercase">
                    {s.status === 'pending' ? 'Corriger' : 'Modifier la correction'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default SubmissionsGrading;