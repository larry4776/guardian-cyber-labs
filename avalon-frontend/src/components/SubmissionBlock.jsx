import React, { useState, useEffect, useContext } from 'react';
import { FileUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

const SubmissionBlock = ({ courseId, domain }) => {
  const { language } = useContext(LanguageContext);
  const { token } = useContext(AuthContext);
  const fr = language === 'fr';

  const [submission, setSubmission] = useState(null);
  const [text, setText] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const deliverableLabel = {
    red_team: { fr: "Rapport d'audit", en: 'Audit report' },
    blue_team: { fr: "Rapport d'incident", en: 'Incident report' },
    grc: { fr: 'Dossier de conformité', en: 'Compliance file' },
  }[domain] || { fr: 'Livrable', en: 'Deliverable' };

  useEffect(() => {
    fetch(`${API_URL}/submissions/me/${courseId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : null)
      .then(data => { setSubmission(data); if (data?.content_text) setText(data.content_text); if (data?.file_url) setFileUrl(data.file_url); })
      .finally(() => setLoading(false));
  }, [courseId, token]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/uploads/file`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
      const data = await res.json();
      setFileUrl(`${API_URL}${data.url}`);
    } catch {
      alert(fr ? "Échec de l'import." : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/submissions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ course_id: courseId, content_text: text, file_url: fileUrl }),
      });
      const data = await res.json();
      setSubmission(data);
    } catch {
      alert(fr ? 'Erreur lors de la soumission.' : 'Error submitting.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  const statusBadge = () => {
    if (!submission) return null;
    if (submission.status === 'validated') {
      return <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase bg-emerald-500/10 px-3 py-1.5 rounded-full"><CheckCircle2 size={14} /> {fr ? 'Validé' : 'Validated'}</span>;
    }
    if (submission.status === 'needs_review') {
      return <span className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase bg-amber-500/10 px-3 py-1.5 rounded-full"><AlertCircle size={14} /> {fr ? 'À revoir' : 'Needs review'}</span>;
    }
    return <span className="flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase bg-blue-500/10 px-3 py-1.5 rounded-full"><Clock size={14} /> {fr ? 'En attente de correction' : 'Pending review'}</span>;
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-white font-bold flex items-center gap-2"><FileUp size={18} className="text-blue-400" /> {fr ? deliverableLabel.fr : deliverableLabel.en}</h3>
        {statusBadge()}
      </div>

      <p className="text-slate-400 text-sm leading-relaxed">
        {fr
          ? 'Dépose ton livrable pour validation finale de ce parcours. Il sera corrigé manuellement par un formateur.'
          : 'Submit your deliverable for final validation of this course. It will be manually reviewed by an instructor.'}
      </p>

      {submission?.status === 'validated' && submission.grade !== null && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-sm text-emerald-400">
          <p className="font-bold mb-1">{fr ? 'Note' : 'Grade'} : {submission.grade}/100</p>
          {(fr ? submission.feedback_fr : submission.feedback_en) && <p className="text-slate-300 mt-2">{fr ? submission.feedback_fr : submission.feedback_en}</p>}
        </div>
      )}

      {submission?.status === 'needs_review' && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-sm text-amber-400">
          <p className="font-bold mb-1">{fr ? 'Retour du formateur' : 'Instructor feedback'}</p>
          <p className="text-slate-300">{fr ? submission.feedback_fr : submission.feedback_en}</p>
        </div>
      )}

      {submission?.status !== 'validated' && (
        <>
          <textarea
            rows="6" value={text} onChange={(e) => setText(e.target.value)}
            placeholder={fr ? 'Rédige ton rapport ici, ou joins un fichier ci-dessous...' : 'Write your report here, or attach a file below...'}
            className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors resize-none"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <label className="bg-slate-950 border border-slate-800 hover:border-blue-500 text-slate-300 hover:text-blue-400 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase cursor-pointer transition-colors">
              {uploading ? (fr ? 'Import...' : 'Uploading...') : fileUrl ? (fr ? '✓ Fichier joint' : '✓ File attached') : (fr ? 'Joindre un fichier (PDF)' : 'Attach a file (PDF)')}
              <input type="file" onChange={(e) => handleFileUpload(e.target.files[0])} className="hidden" disabled={uploading} />
            </label>
            <button onClick={submit} disabled={saving || (!text && !fileUrl)} className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors ml-auto">
              {saving ? (fr ? 'Envoi...' : 'Submitting...') : submission ? (fr ? 'Renvoyer' : 'Resubmit') : (fr ? 'Soumettre' : 'Submit')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
export default SubmissionBlock;