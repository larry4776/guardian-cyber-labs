import React, { useState, useContext } from 'react';
import { FileText, Terminal, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

const ExerciseBlock = ({ exercise }) => {
  const { language, t } = useContext(LanguageContext);
  const { token } = useContext(AuthContext);
  const fr = language === 'fr';

  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [terminalHistory, setTerminalHistory] = useState([]);
  const [terminalInput, setTerminalInput] = useState('');

  const submitAnswer = async (value) => {
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/exercises/${exercise.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answer: value }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ is_correct: false, message_fr: 'Erreur lors de la soumission.', message_en: 'Error submitting answer.' });
    } finally {
      setSubmitting(false);
    }
  };

  const runTerminalCommand = () => {
    const script = exercise.terminal_script ? JSON.parse(exercise.terminal_script) : [];
    const match = script.find(s => s.command.trim().toLowerCase() === terminalInput.trim().toLowerCase());
    const response = match ? match.response : (fr ? 'Commande inconnue.' : 'Command not recognized.');
    setTerminalHistory([...terminalHistory, { command: terminalInput, response }]);
    setTerminalInput('');
  };

  const icon = exercise.type === 'file_challenge' ? <FileText size={18} /> : exercise.type === 'terminal' ? <Terminal size={18} /> : <HelpCircle size={18} />;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-blue-400">{icon}</span>
        <h3 className="text-white font-bold">{t(exercise, 'title_fr', 'title_en')}</h3>
      </div>
      {t(exercise, 'description_fr', 'description_en') && (
        <p className="text-slate-400 text-sm leading-relaxed">{t(exercise, 'description_fr', 'description_en')}</p>
      )}

      {exercise.type === 'file_challenge' && (
        <div className="space-y-3">
          {exercise.file_url && (
            <a href={exercise.file_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-blue-500/40 rounded-lg px-4 py-2.5 text-sm text-blue-400 font-semibold transition-colors">
              <FileText size={16} /> {fr ? 'Télécharger le fichier' : 'Download file'}
            </a>
          )}
          <div className="flex gap-3">
            <input
              type="text" value={answer} onChange={(e) => setAnswer(e.target.value)}
              placeholder={fr ? 'Ta réponse (flag)...' : 'Your answer (flag)...'}
              className="flex-1 bg-slate-950 border border-slate-800 text-white px-4 py-2.5 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors"
            />
            <button onClick={() => submitAnswer(answer)} disabled={submitting || !answer}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              {fr ? 'Soumettre' : 'Submit'}
            </button>
          </div>
        </div>
      )}

      {exercise.type === 'terminal' && (
        <div className="space-y-3">
          <div className="bg-black rounded-lg p-4 font-mono text-xs text-emerald-400 h-48 overflow-y-auto space-y-2">
            {terminalHistory.map((h, i) => (
              <div key={i}>
                <p className="text-slate-400">$ {h.command}</p>
                <p className="whitespace-pre-wrap">{h.response}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <input
              type="text" value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runTerminalCommand()}
              placeholder={fr ? 'Tape une commande...' : 'Type a command...'}
              className="flex-1 bg-slate-950 border border-slate-800 text-emerald-400 font-mono px-4 py-2.5 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors"
            />
            <button onClick={runTerminalCommand} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              {fr ? 'Exécuter' : 'Run'}
            </button>
          </div>
        </div>
      )}

      {exercise.type === 'scenario' && exercise.scenario_data && (() => {
        const data = JSON.parse(exercise.scenario_data);
        const options = fr ? data.options_fr : data.options_en;
        return (
          <div className="space-y-3">
            <p className="text-slate-200 text-sm font-medium">{fr ? data.question_fr : data.question_en}</p>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <button key={i} onClick={() => submitAnswer(String(i))} disabled={submitting}
                  className="w-full text-left bg-slate-950 border border-slate-800 hover:border-blue-500/40 rounded-lg px-4 py-3 text-sm text-slate-300 transition-colors">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {result && (
        <div className={`flex items-center gap-2 text-sm rounded-lg px-4 py-3 ${result.is_correct ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {result.is_correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {fr ? result.message_fr : result.message_en}
        </div>
      )}
    </div>
  );
};
export default ExerciseBlock;