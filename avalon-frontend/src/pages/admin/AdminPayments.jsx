import React, { useState, useEffect, useContext } from 'react';
import AdminLayout from './AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import { API_URL } from '../../config';

const AdminPayments = () => {
  const { token } = useContext(AuthContext);
  const authHeaders = { Authorization: `Bearer ${token}` };
  const [methods, setMethods] = useState([]);
  const [uploading, setUploading] = useState(null);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/payment-methods/all`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : []).then(setMethods);
  }, []);

  const updateField = (key, field, value) => {
    setMethods(methods.map(m => m.key === key ? { ...m, [field]: value } : m));
  };

  const handleLogoUpload = async (key, file) => {
    if (!file) return;
    setUploading(key);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/uploads/image`, { method: 'POST', headers: authHeaders, body: formData });
      const data = await res.json();
      updateField(key, 'logo_url', `${API_URL}${data.url}`);
    } catch { alert("Échec de l'import du logo."); }
    finally { setUploading(null); }
  };

  const saveMethod = async (m) => {
    await fetch(`${API_URL}/payment-methods/${m.key}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ display_name: m.display_name, logo_url: m.logo_url, receiving_info: m.receiving_info, enabled: m.enabled }),
    });
    setSaveMsg(`✓ ${m.display_name} enregistré.`);
    setTimeout(() => setSaveMsg(''), 2500);
  };

  return (
    <AdminLayout title="Moyens de paiement">
      <div className="space-y-4">
        {saveMsg && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg px-4 py-3">{saveMsg}</div>}
        {methods.map((m) => (
          <div key={m.key} className="bg-surface border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white uppercase">{m.key}</span>
              <label className="flex items-center gap-2 text-xs text-slate-400">
                <input type="checkbox" checked={m.enabled} onChange={(e) => updateField(m.key, 'enabled', e.target.checked)} className="accent-primary" />
                Actif
              </label>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <input type="text" placeholder="Nom affiché" value={m.display_name}
                onChange={(e) => updateField(m.key, 'display_name', e.target.value)}
                className="bg-white/[0.03] border border-white/10 px-3 py-2 text-sm rounded-lg text-white outline-none focus:border-primary/50" />
              <input type="text" placeholder="Infos de réception" value={m.receiving_info || ''}
                onChange={(e) => updateField(m.key, 'receiving_info', e.target.value)}
                className="bg-white/[0.03] border border-white/10 px-3 py-2 text-sm rounded-lg text-white outline-none focus:border-primary/50" />
            </div>
            <div className="flex items-center gap-3">
              {m.logo_url && <img src={m.logo_url} alt="" className="h-8 object-contain bg-white/5 rounded px-2 py-1" />}
              <label className="bg-white/[0.03] border border-white/10 hover:border-primary/40 text-slate-300 hover:text-primary-light px-3 py-2 rounded-lg text-xs font-semibold uppercase cursor-pointer transition-colors">
                {uploading === m.key ? 'Import...' : 'Choisir un logo'}
                <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(m.key, e.target.files[0])} className="hidden" disabled={uploading === m.key} />
              </label>
              <button onClick={() => saveMethod(m)} className="ml-auto bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold px-4 py-2 rounded-lg">
                Enregistrer
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};
export default AdminPayments;