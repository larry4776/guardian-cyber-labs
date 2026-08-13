import React, { useState, useEffect, useContext } from 'react';
import AdminLayout from './AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import { API_URL } from '../../config';

const AdminUsers = () => {
  const { token, user: currentUser } = useContext(AuthContext);
  const authHeaders = { Authorization: `Bearer ${token}` };
  const [users, setUsers] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ email: '', password: '', first_name: '' });
  const [msg, setMsg] = useState('');

  const loadUsers = () => {
    fetch(`${API_URL}/admin/users`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : []).then(setUsers);
  };

  useEffect(() => { loadUsers(); }, []);

  const changeRole = async (userId, newRole) => {
    await fetch(`${API_URL}/admin/users/${userId}/role`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ role: newRole }),
    });
    loadUsers();
  };

  const deleteUser = async (userId, email) => {
    if (email === currentUser?.email) { alert("Tu ne peux pas supprimer ton propre compte."); return; }
    if (!window.confirm(`Supprimer définitivement le compte de ${email} ?`)) return;
    await fetch(`${API_URL}/admin/users/${userId}`, { method: 'DELETE', headers: authHeaders });
    loadUsers();
  };

  const createAdmin = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(newAdmin),
      });
      if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data.detail || 'Erreur.'); }
      setMsg('✓ Administrateur créé.');
      setNewAdmin({ email: '', password: '', first_name: '' });
      loadUsers();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { setMsg(err.message); }
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <AdminLayout title="Gestion des utilisateurs">
      <div className="space-y-6">
        {msg && (
          <div className={`text-sm rounded-lg px-4 py-3 ${msg.startsWith('✓') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>{msg}</div>
        )}
        <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-white/10 pb-4">Ajouter un administrateur</h3>
          <form onSubmit={createAdmin} className="space-y-3">
            <div className="grid md:grid-cols-3 gap-3">
              <input type="text" placeholder="Prénom" value={newAdmin.first_name}
                onChange={(e) => setNewAdmin({ ...newAdmin, first_name: e.target.value })}
                className="bg-white/[0.03] border border-white/10 px-3 py-2 text-sm rounded-lg text-white outline-none focus:border-primary/50" />
              <input type="email" placeholder="Email" required value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                className="bg-white/[0.03] border border-white/10 px-3 py-2 text-sm rounded-lg text-white outline-none focus:border-primary/50" />
              <input type="password" placeholder="Mot de passe" required value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                className="bg-white/[0.03] border border-white/10 px-3 py-2 text-sm rounded-lg text-white outline-none focus:border-primary/50" />
            </div>
            <button type="submit" className="bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
              Créer l'administrateur
            </button>
          </form>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-sm font-bold text-white">Tous les utilisateurs ({users.length})</h3>
          </div>
          <table className="w-full text-xs text-left">
            <thead className="bg-white/[0.03] text-muted uppercase">
              <tr>
                <th className="p-4">Nom</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rôle</th>
                <th className="p-4">Inscrit le</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="p-4 text-slate-300">{u.first_name || '—'} {u.last_name || ''}</td>
                  <td className="p-4 text-slate-400">{u.email}</td>
                  <td className="p-4">
                    <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)}
                      className="bg-white/[0.03] border border-white/10 text-white text-[11px] px-2 py-1 rounded outline-none">
                      <option value="student">student</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="p-4 text-muted">{formatDate(u.created_at)}</td>
                  <td className="p-4">
                    <button onClick={() => deleteUser(u.id, u.email)} className="text-red-400 hover:text-red-300 font-semibold uppercase text-[11px]">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminUsers;