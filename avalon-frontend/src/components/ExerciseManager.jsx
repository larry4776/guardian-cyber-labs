import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const EMPTY_EXERCISE = {
  type: 'file_challenge',
  title_fr: '', title_en: '', description_fr: '', description_en: '',
  file_url: '', correct_answer: '',
  terminal_commands: [{ command: '', response: '' }],
  question_fr: '', question_en: '', options_fr: ['', ''], options_en: ['', ''], correct_index: 0,
};

const ExerciseManager = ({ courseId, authHeaders }) => {
  const [exercises, setExercises] = useState([]);
  const [form, setForm] = useState(EMPTY_EXERCISE);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');

  const loadExercises = () => {
    if (!courseId || courseId === 'new') { setExercises([]); return; }
    fetch(`${API_URL}/exercises/admin/course/${courseId}`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : [])
      .then(setExercises);
  };

  useEffect(() => { loadExercises(); }, [courseId]);

  if (!courseId || courseId === 'new') {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <p className="text-slate-500 text-sm">Enregistre d'abord le parcours pour pouvoir y ajouter des exercices.</p>
      </div>
    );
  }

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/uploads/file`, { method: 'POST', headers: authHeaders, body: formData });
      const data = await res.json();
      setForm({ ...form, file_url: `${API_URL}${data.url}` });
    } catch {
      alert("Échec de l'import du fichier.");
    } finally {
      setUploading(false);
    }
  };

  const updateCommand = (index, field, value) => {
    const updated = [...form.terminal_commands];
    updated[index][field] = value;
    setForm({ ...form, terminal_commands: updated });
  };

  const addCommand = () => setForm({ ...form, terminal_commands: [...form.terminal_commands, { command: '', response: '' }] });
  const removeCommand = (index) => setForm({ ...form, terminal_commands: form.terminal_commands.filter((_, i) => i !== index) });

  const updateOption = (lang, index, value) => {
    const key = lang === 'fr' ? 'options_fr' : 'options_en';
    const updated = [...form[key]];
    updated[index] = value;
    setForm({ ...form, [key]: updated });
  };
  const addOption = () => setForm({ ...form, options_fr: [...form.options_fr, ''], options_en: [...form.options_en, ''] });
  const removeOption = (index) => setForm({
    ...form,
    options_fr: form.options_fr.filter((_, i) => i !== index),
    options_en: form.options_en.filter((_, i) => i !== index),
  });

  const saveExercise = async () => {
    setMsg('');
    const payload = {
      course_id: parseInt(courseId),
      type: form.type,
      title_fr: form.title_fr,
      title_en: form.title_en,
      description_fr: form.description_fr,
      description_en: form.description_en,
      order: 0,
    };

    if (form.type === 'file_challenge') {
      payload.file_url = form.file_url;
      payload.correct_answer = form.correct_answer;
    }
    if (form.type === 'terminal') {
      payload.terminal_script = JSON.stringify(form.terminal_commands);
    }
    if (form.type === 'scenario') {
      payload.scenario_data = JSON.stringify({
        question_fr: form.question_fr,
        question_en: form.question_en,
        options_fr: form.options_fr,
        options_en: form.options_en,
        correct_index: form.correct_index,
      });
      payload.correct_answer = String(form.correct_index);
    }

    try {
      const res = await fetch(`${API_URL}/exercises/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setMsg('✓ Exercice ajouté.');
      setForm(EMPTY_EXERCISE);
      loadExercises();
      setTimeout(() => setMsg(''), 3000);
    } catch {
      setMsg("Erreur lors de l'enregistrement.");
    }
  };

  const deleteExercise = async (id) => {
    if (!window.confirm('Supprimer cet exercice ?')) return;
    await fetch(`${API_URL}/exercises/${id}`, { method: 'DELETE', headers: authHeaders });
    loadExercises();
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
      <h3 className="text-sm font-bold text-white">Exercices pratiques du parcours</h3>

      {exercises.length > 0 && (
        <div className="space-y-2">
          {exercises.map(ex => (
            <div key={ex.id} className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400">{ex.type}</span>
                <p className="text-sm text-slate-200">{ex.title_fr}</p>
              </div>
              <button onClick={() => deleteExercise(ex.id)} className="text-red-400 hover:text-red-300 text-xs font-semibold uppercase">Supprimer</button>
            </div>
          ))}
        </div>
      )}

      {msg && (
        <div className={`text-sm rounded-lg px-4 py-3 ${msg.startsWith('✓') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {msg}
        </div>
      )}

      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ajouter un exercice</span>

        <select value={form.type} onChange={(e) => setForm({ ...EMPTY_EXERCISE, type: e.target.value })}
          className="bg-slate-900 border border-slate-800 text-white text-xs px-3 py-2 rounded-lg outline-none w-full">
          <option value="file_challenge">Fichier à analyser (flag)</option>
          <option value="terminal">Terminal simulé</option>
          <option value="scenario">Scénario de décision</option>
        </select>

        <div className="grid md:grid-cols-2 gap-3">
          <input type="text" placeholder="Titre (FR)" value={form.title_fr} onChange={(e) => setForm({ ...form, title_fr: e.target.value })}
            className="bg-slate-900 border border-slate-800 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-blue-500" />
          <input type="text" placeholder="Title (EN)" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })}
            className="bg-slate-900 border border-slate-800 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-blue-500" />
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <textarea placeholder="Description (FR)" rows="2" value={form.description_fr} onChange={(e) => setForm({ ...form, description_fr: e.target.value })}
            className="bg-slate-900 border border-slate-800 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-blue-500 resize-none" />
          <textarea placeholder="Description (EN)" rows="2" value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })}
            className="bg-slate-900 border border-slate-800 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-blue-500 resize-none" />
        </div>

        {form.type === 'file_challenge' && (
          <div className="space-y-3">
            <label className="bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-300 hover:text-blue-400 px-3 py-2 rounded-lg text-[10px] font-semibold uppercase cursor-pointer inline-block transition-colors">
              {uploading ? 'Import...' : form.file_url ? '✓ Fichier importé' : 'Choisir le fichier de l\'exercice'}
              <input type="file" onChange={(e) => handleFileUpload(e.target.files[0])} className="hidden" disabled={uploading} />
            </label>
            <input type="text" placeholder="Réponse correcte (flag)" value={form.correct_answer} onChange={(e) => setForm({ ...form, correct_answer: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-blue-500" />
          </div>
        )}

        {form.type === 'terminal' && (
          <div className="space-y-2">
            <span className="text-[10px] text-slate-500 uppercase">Commandes attendues et réponses simulées</span>
            {form.terminal_commands.map((c, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-start">
                <input type="text" placeholder="Commande (ex: nmap -sV target)" value={c.command} onChange={(e) => updateCommand(i, 'command', e.target.value)}
                  className="col-span-5 bg-slate-900 border border-slate-800 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-blue-500" />
                <textarea rows="2" placeholder="Réponse simulée" value={c.response} onChange={(e) => updateCommand(i, 'response', e.target.value)}
                  className="col-span-6 bg-slate-900 border border-slate-800 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-blue-500 resize-none" />
                <button onClick={() => removeCommand(i)} className="col-span-1 text-red-400 hover:text-red-300 text-xs font-bold">✕</button>
              </div>
            ))}
            <button onClick={addCommand} className="text-xs text-blue-400 hover:text-blue-300 font-semibold">+ Ajouter une commande</button>
          </div>
        )}

        {form.type === 'scenario' && (
          <div className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <textarea rows="2" placeholder="Question (FR)" value={form.question_fr} onChange={(e) => setForm({ ...form, question_fr: e.target.value })}
                className="bg-slate-900 border border-slate-800 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-blue-500 resize-none" />
              <textarea rows="2" placeholder="Question (EN)" value={form.question_en} onChange={(e) => setForm({ ...form, question_en: e.target.value })}
                className="bg-slate-900 border border-slate-800 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-blue-500 resize-none" />
            </div>
            <span className="text-[10px] text-slate-500 uppercase">Options de réponse (coche la bonne)</span>
            {form.options_fr.map((opt, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input type="radio" checked={form.correct_index === i} onChange={() => setForm({ ...form, correct_index: i })} className="col-span-1 accent-emerald-500" />
                <input type="text" placeholder={`Option ${i + 1} (FR)`} value={opt} onChange={(e) => updateOption('fr', i, e.target.value)}
                  className="col-span-5 bg-slate-900 border border-slate-800 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-blue-500" />
                <input type="text" placeholder={`Option ${i + 1} (EN)`} value={form.options_en[i]} onChange={(e) => updateOption('en', i, e.target.value)}
                  className="col-span-5 bg-slate-900 border border-slate-800 px-3 py-2 text-xs rounded-lg text-white outline-none focus:border-blue-500" />
                <button onClick={() => removeOption(i)} className="col-span-1 text-red-400 hover:text-red-300 text-xs font-bold">✕</button>
              </div>
            ))}
            <button onClick={addOption} className="text-xs text-blue-400 hover:text-blue-300 font-semibold">+ Ajouter une option</button>
          </div>
        )}

        <button onClick={saveExercise} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
          Ajouter l'exercice
        </button>
      </div>
    </div>
  );
};
export default ExerciseManager;