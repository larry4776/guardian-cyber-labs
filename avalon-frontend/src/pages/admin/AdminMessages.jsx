import React, { useState, useEffect, useContext } from 'react';
import AdminLayout from './AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import { API_URL } from '../../config';

const AdminMessages = () => {
  const { token } = useContext(AuthContext);
  const authHeaders = { Authorization: `Bearer ${token}` };
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replyMsg, setReplyMsg] = useState('');

  const [showCompose, setShowCompose] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeMessage, setComposeMessage] = useState('');
  const [sendingCompose, setSendingCompose] = useState(false);
  const [composeMsg, setComposeMsg] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/contact/`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : [])
      .then(setMessages);
    fetch(`${API_URL}/admin/users`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : [])
      .then(setUsers);
  }, []);

  const resolveMessage = async (id) => {
    await fetch(`${API_URL}/contact/${id}/resolve`, { method: 'PUT', headers: authHeaders });
    setMessages(messages.map(m => m.id === id ? { ...m, resolved: true } : m));
  };

  const sendReply = async (messageId) => {
    setSendingReply(true);
    setReplyMsg('');
    try {
      const res = await fetch(`${API_URL}/contact/${messageId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ reply: replyText }),
      });
      if (!res.ok) throw new Error();
      setReplyMsg('✓ Réponse envoyée.');
      setReplyingId(null);
      setReplyText('');
      setMessages(messages.map(m => m.id === messageId ? { ...m, resolved: true } : m));
      setTimeout(() => setReplyMsg(''), 3000);
    } catch {
      setReplyMsg('Erreur lors de l\'envoi.');
    } finally {
      setSendingReply(false);
    }
  };

  const toggleUser = (userId) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map(u => u.id));
    }
    setSelectAll(!selectAll);
  };

  const sendCompose = async () => {
    if (!composeSubject || !composeMessage || selectedUserIds.length === 0) return;
    setSendingCompose(true);
    setComposeMsg('');
    try {
      const res = await fetch(`${API_URL}/contact/admin/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({
          user_ids: selectedUserIds,
          subject: composeSubject,
          message: composeMessage,
        }),
      });
      if (!res.ok) throw new Error();
      setComposeMsg(`✓ Message envoyé à ${selectedUserIds.length} utilisateur(s).`);
      setComposeSubject('');
      setComposeMessage('');
      setSelectedUserIds([]);
      setSelectAll(false);
      setShowCompose(false);
      setTimeout(() => setComposeMsg(''), 4000);
    } catch {
      setComposeMsg('Erreur lors de l\'envoi.');
    } finally {
      setSendingCompose(false);
    }
  };

  return (
    <AdminLayout title="Messages">
      <div className="space-y-6">

        {/* Bouton composer */}
        <div className="flex items-center justify-between">
          <p className="text-muted text-sm">{messages.length} message(s) reçu(s)</p>
          <button onClick={() => setShowCompose(!showCompose)}
            className="bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-shadow">
            {showCompose ? 'Fermer' : '+ Nouveau message'}
          </button>
        </div>

        {composeMsg && (
          <div className={`text-sm rounded-lg px-4 py-3 ${composeMsg.startsWith('✓') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
            {composeMsg}
          </div>
        )}

        {/* Formulaire de composition */}
        {showCompose && (
          <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-4">Envoyer un message</h3>

            {/* Sélection des destinataires */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-400">Destinataires ({selectedUserIds.length} sélectionné(s))</label>
                <button onClick={toggleSelectAll} className="text-xs text-primary-light hover:text-white font-semibold">
                  {selectAll ? 'Tout désélectionner' : 'Tout sélectionner'}
                </button>
              </div>
              <div className="bg-white/[0.02] border border-white/10 rounded-lg max-h-48 overflow-y-auto">
                {users.map(u => (
                  <label key={u.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0">
                    <input type="checkbox" checked={selectedUserIds.includes(u.id)} onChange={() => toggleUser(u.id)} className="accent-primary" />
                    <div>
                      <p className="text-sm text-white">{u.first_name || ''} {u.last_name || ''}</p>
                      <p className="text-xs text-muted">{u.email}</p>
                    </div>
                    <span className={`ml-auto text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-primary/10 text-primary-light' : 'bg-white/5 text-muted'}`}>
                      {u.role}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <input type="text" placeholder="Objet du message" value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50" />

            <textarea rows="5" placeholder="Contenu du message..." value={composeMessage}
              onChange={(e) => setComposeMessage(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 resize-none" />

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted">{selectedUserIds.length} destinataire(s) sélectionné(s)</p>
              <button onClick={sendCompose} disabled={sendingCompose || !composeSubject || !composeMessage || selectedUserIds.length === 0}
                className="bg-gradient-to-r from-primary to-primary-dark disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg text-sm">
                {sendingCompose ? 'Envoi...' : 'Envoyer'}
              </button>
            </div>
          </div>
        )}

        {/* Messages reçus */}
        <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-sm font-bold text-white">Messages reçus</h3>
          </div>

          {replyMsg && (
            <div className={`mx-6 mt-4 text-sm rounded-lg px-4 py-3 ${replyMsg.startsWith('✓') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
              {replyMsg}
            </div>
          )}

          <div className="divide-y divide-white/5">
            {messages.length > 0 ? messages.map(m => (
              <div key={m.id} className="p-6 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-white font-semibold text-sm">{m.email}</p>
                      <span className="text-muted text-xs">— {m.subject}</span>
                      {m.resolved && <span className="text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">Traité</span>}
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{m.message}</p>
                  </div>
                </div>

                {replyingId === m.id ? (
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <textarea rows="3" placeholder="Votre réponse..." value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => sendReply(m.id)} disabled={sendingReply || !replyText}
                        className="bg-gradient-to-r from-primary to-primary-dark disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg">
                        {sendingReply ? 'Envoi...' : 'Envoyer la réponse'}
                      </button>
                      <button onClick={() => { setReplyingId(null); setReplyText(''); }}
                        className="text-slate-400 hover:text-white text-sm font-semibold px-4 py-2">
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => { setReplyingId(m.id); setReplyText(''); }}
                      className="text-primary-light hover:text-white text-xs font-semibold uppercase">
                      Répondre
                    </button>
                    {!m.resolved && (
                      <button onClick={() => resolveMessage(m.id)}
                        className="text-slate-500 hover:text-slate-300 text-xs font-semibold uppercase">
                        Marquer traité
                      </button>
                    )}
                  </div>
                )}
              </div>
            )) : (
              <div className="p-6 text-center text-slate-600 text-sm">Aucun message pour l'instant.</div>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
export default AdminMessages;