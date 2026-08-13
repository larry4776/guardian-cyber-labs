import React, { useState, useEffect, useContext } from 'react';
import AdminLayout from './AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import { API_URL } from '../../config';

const DEFAULT_TESTIMONIALS = [
  { id: 1, name: 'Koffi A.', role: 'Analyste SOC', text: "Les parcours sont vraiment pratiques, j'ai pu appliquer directement ce que j'ai appris en entreprise. La certification m'a ouvert des portes.", stars: 5 },
  { id: 2, name: 'Mariama D.', role: 'Étudiante en cybersécurité', text: 'Le module Blue Team est excellent. Les exercices pratiques sont bien pensés et la correction manuelle des livrables est un vrai plus.', stars: 5 },
  { id: 3, name: 'Ibrahim S.', role: 'Consultant GRC', text: "J'ai validé ma certification GRC en quelques semaines. Le contenu est dense et de qualité, adapté aux réalités du marché africain.", stars: 5 },
];

const AdminSettings = () => {
  const { token } = useContext(AuthContext);
  const authHeaders = { Authorization: `Bearer ${token}` };

  const [settings, setSettings] = useState({
    currency: 'FCFA',
    stats_learners: '500+',
    stats_certified: '120+',
    stats_courses: '9',
    stats_rating: '4.8/5',
  });

  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', text: '', stars: 5 });
  const [msg, setMsg] = useState('');
  const [msgTestimonial, setMsgTestimonial] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/settings/`, { headers: authHeaders })
      .then(res => res.ok ? res.json() : {})
      .then(data => {
        if (Object.keys(data).length > 0) setSettings(prev => ({ ...prev, ...data }));
        if (data.testimonials) {
          try {
            const parsed = JSON.parse(data.testimonials);
            setTestimonials(parsed);
          } catch {
            setTestimonials(DEFAULT_TESTIMONIALS);
          }
        } else {
          // Aucun témoignage en base — on charge les défauts et on les sauvegarde
          setTestimonials(DEFAULT_TESTIMONIALS);
          fetch(`${API_URL}/settings/testimonials`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify({ value: JSON.stringify(DEFAULT_TESTIMONIALS) }),
          });
        }
      })
      .catch(() => setTestimonials(DEFAULT_TESTIMONIALS));
  }, []);

  const saveSetting = async (key, value) => {
    await fetch(`${API_URL}/settings/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ value }),
    });
  };

  const saveAllSettings = async () => {
    setMsg('');
    try {
      await Promise.all([
        saveSetting('currency', settings.currency),
        saveSetting('stats_learners', settings.stats_learners),
        saveSetting('stats_certified', settings.stats_certified),
        saveSetting('stats_courses', settings.stats_courses),
        saveSetting('stats_rating', settings.stats_rating),
      ]);
      setMsg('✓ Réglages enregistrés.');
      setTimeout(() => setMsg(''), 3000);
    } catch {
      setMsg('Erreur lors de la sauvegarde.');
    }
  };

  const addTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.text) return;
    const updated = [...testimonials, { ...newTestimonial, id: Date.now() }];
    setTestimonials(updated);
    await saveSetting('testimonials', JSON.stringify(updated));
    setNewTestimonial({ name: '', role: '', text: '', stars: 5 });
    setMsgTestimonial('✓ Témoignage ajouté.');
    setTimeout(() => setMsgTestimonial(''), 3000);
  };

  const deleteTestimonial = async (id) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    await saveSetting('testimonials', JSON.stringify(updated));
    setMsgTestimonial('✓ Témoignage supprimé.');
    setTimeout(() => setMsgTestimonial(''), 3000);
  };

  return (
    <AdminLayout title="Réglages de la plateforme">
      <div className="space-y-8">

        {/* Devise & Chiffres clés */}
        <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-white border-b border-white/10 pb-4">Devise & Chiffres clés</h3>

          {msg && (
            <div className={`text-sm rounded-lg px-4 py-3 ${msg.startsWith('✓') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
              {msg}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-400 mb-2 block">Devise affichée sur le site</label>
            <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none w-full md:w-64">
              <option value="FCFA">FCFA (Franc CFA)</option>
              <option value="USD">USD (Dollar américain)</option>
              <option value="EUR">EUR (Euro)</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-2 block">Nombre d'apprenants inscrits</label>
              <input type="text" value={settings.stats_learners}
                onChange={(e) => setSettings({ ...settings, stats_learners: e.target.value })}
                placeholder="ex: 500+"
                className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-2 block">Nombre de certifiés</label>
              <input type="text" value={settings.stats_certified}
                onChange={(e) => setSettings({ ...settings, stats_certified: e.target.value })}
                placeholder="ex: 120+"
                className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-2 block">Nombre de parcours disponibles</label>
              <input type="text" value={settings.stats_courses}
                onChange={(e) => setSettings({ ...settings, stats_courses: e.target.value })}
                placeholder="ex: 9"
                className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-2 block">Note moyenne</label>
              <input type="text" value={settings.stats_rating}
                onChange={(e) => setSettings({ ...settings, stats_rating: e.target.value })}
                placeholder="ex: 4.8/5"
                className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50" />
            </div>
          </div>

          <button onClick={saveAllSettings}
            className="bg-gradient-to-r from-primary to-primary-dark text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-shadow hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            Enregistrer les réglages
          </button>
        </div>

        {/* Témoignages */}
        <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-white border-b border-white/10 pb-4">
            Témoignages ({testimonials.length})
          </h3>

          {msgTestimonial && (
            <div className={`text-sm rounded-lg px-4 py-3 ${msgTestimonial.startsWith('✓') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
              {msgTestimonial}
            </div>
          )}

          {/* Liste des témoignages existants */}
          {testimonials.length > 0 && (
            <div className="space-y-3">
              {testimonials.map(t => (
                <div key={t.id} className="bg-white/[0.02] border border-white/10 rounded-lg p-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <span className="text-muted text-xs">— {t.role}</span>
                      <span className="text-amber-400 text-xs">{'★'.repeat(t.stars)}</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">"{t.text}"</p>
                  </div>
                  <button onClick={() => deleteTestimonial(t.id)}
                    className="text-red-400 hover:text-red-300 text-xs font-semibold shrink-0 uppercase">
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Ajouter un témoignage */}
          <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Ajouter un témoignage</p>
            <div className="grid md:grid-cols-2 gap-3">
              <input type="text" placeholder="Nom (ex: Koffi A.)" value={newTestimonial.name}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                className="bg-white/[0.03] border border-white/10 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-primary/50" />
              <input type="text" placeholder="Rôle (ex: Analyste SOC)" value={newTestimonial.role}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                className="bg-white/[0.03] border border-white/10 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-primary/50" />
            </div>
            <textarea rows="3" placeholder="Témoignage..." value={newTestimonial.text}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/10 text-white px-3 py-2 rounded-lg text-sm outline-none focus:border-primary/50 resize-none" />
            <div className="flex items-center gap-3">
              <label className="text-xs text-slate-400">Note :</label>
              <select value={newTestimonial.stars}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, stars: parseInt(e.target.value) })}
                className="bg-white/[0.03] border border-white/10 text-white px-3 py-2 rounded-lg text-sm outline-none">
                <option value={5}>★★★★★ (5)</option>
                <option value={4}>★★★★☆ (4)</option>
                <option value={3}>★★★☆☆ (3)</option>
              </select>
              <button onClick={addTestimonial} disabled={!newTestimonial.name || !newTestimonial.text}
                className="ml-auto bg-gradient-to-r from-primary to-primary-dark disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg">
                Ajouter
              </button>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
export default AdminSettings;