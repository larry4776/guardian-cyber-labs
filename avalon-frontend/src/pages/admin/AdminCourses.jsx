import React, { useState } from 'react';
import { Search, BookOpen, Zap, HelpCircle, ChevronDown, X } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { CONTENU } from '../../data/courses';
import { pageWrapper, mainContent, card, inputStyle, labelStyle, btnPrimary, btnSecondary } from '../../styles/theme';

const TABS = ['Leçons', 'Quiz', 'Exercices'];

const MODAL_INIT = {
  titre: '', parcours: '', famille: 'RED TEAM',
  type: 'Leçon', tags: '', contenu: '',
};

const TypeIcon = ({ type }) => {
  if (type === 'book') return <BookOpen size={14} />;
  if (type === 'zap') return <Zap size={14} />;
  return <HelpCircle size={14} />;
};

const familleColors = (f) => {
  if (f === 'RED TEAM') return { color: '#c0505a', bg: 'rgba(192,80,90,0.15)' };
  if (f === 'BLUE TEAM') return { color: '#4a7fc2', bg: 'rgba(74,127,194,0.15)' };
  return { color: '#c9a94e', bg: 'rgba(201,169,78,0.15)' };
};

const AdminCourses = () => {
  const [activeTab, setActiveTab] = useState('Leçons');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(MODAL_INIT);
  const [contenu, setContenu] = useState(CONTENU);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const filtered = contenu.filter(c =>
    c.titre.toLowerCase().includes(search.toLowerCase()) ||
    c.parcours.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!form.titre || !form.parcours) return;
    setSaving(true);
    setTimeout(() => {
      const fc = familleColors(form.famille);
      setContenu(prev => [{
        titre: form.titre, parcours: form.parcours,
        famille: form.famille, familleColor: fc.color, familleBg: fc.bg,
        type: form.type,
        typeIcon: form.type === 'Leçon' ? 'book' : form.type === 'Exercice' ? 'zap' : 'quiz',
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      }, ...prev]);
      setSaving(false);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setShowModal(false); setForm(MODAL_INIT); }, 1200);
    }, 600);
  };

  return (
    <div style={pageWrapper}>
      <AdminSidebar />
      <div style={mainContent}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>Gestion du contenu</h1>
            <p style={{ fontSize: '13px', color: '#8A93A6', marginTop: '4px' }}>Leçons, quiz et exercices</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={btnSecondary}>Importer</button>
            <button style={btnPrimary} onClick={() => setShowModal(true)}>+ Nouvelle leçon</button>
          </div>
        </div>

        {/* Onglets */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '10px 20px', border: 'none', background: 'none',
              color: activeTab === tab ? '#fff' : '#8A93A6',
              fontSize: '14px', fontWeight: activeTab === tab ? '600' : '400',
              cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid #3b6df0' : '2px solid transparent',
              marginBottom: '-1px',
            }}>{tab}</button>
          ))}
        </div>

        {/* Recherche */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8A93A6' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une leçon…"
              style={{ ...inputStyle, paddingLeft: '40px' }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <select style={{ appearance: 'none', padding: '10px 36px 10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '13px', cursor: 'pointer', outline: 'none' }}>
              <option>Tous les parcours</option>
              <option>Pentest Web</option>
              <option>SOC Analyst L1</option>
              <option>ISO 27001 Lead</option>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8A93A6', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Tableau */}
        <div style={{ ...card, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['TITRE', 'FAMILLE', 'TYPE', 'SKILL-TAGS', 'STATUT', ''].map((h, i) => (
                  <th key={i} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#8A93A6' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={i} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{item.titre}</div>
                    <div style={{ fontSize: '11px', color: '#8A93A6', marginTop: '2px' }}>{item.parcours}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', color: item.familleColor, background: item.familleBg }}>{item.famille}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8A93A6', fontSize: '13px' }}>
                      <TypeIcon type={item.typeIcon} />{item.type}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {item.tags.map((tag, ti) => (
                        <span key={ti} style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', color: '#8A93A6', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>[{tag}]</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', color: '#6a9e6a', background: 'rgba(106,158,106,0.15)' }}>Actif</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button style={{ fontSize: '12px', fontWeight: '600', padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer' }}>Éditer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ width: '520px', maxHeight: '90vh', overflowY: 'auto', background: 'linear-gradient(135deg, #0d1025 0%, #12103a 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '28px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#fff' }}>+ Nouvelle leçon</h2>
              <button onClick={() => { setShowModal(false); setForm(MODAL_INIT); }} style={{ background: 'none', border: 'none', color: '#8A93A6', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {success && (
              <div style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', background: 'rgba(106,158,106,0.12)', border: '1px solid rgba(106,158,106,0.3)', color: '#6a9e6a', fontSize: '13px', fontWeight: '600' }}>
                ✓ Leçon ajoutée avec succès !
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>TITRE DE LA LEÇON *</label>
                <input name="titre" value={form.titre} onChange={handleChange} placeholder="Ex : Introduction au Pentest Web" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>PARCOURS ASSOCIÉ *</label>
                <input name="parcours" value={form.parcours} onChange={handleChange} placeholder="Ex : Pentest Web" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>FAMILLE</label>
                  <select name="famille" value={form.famille} onChange={handleChange} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                    <option value="RED TEAM">RED TEAM</option>
                    <option value="BLUE TEAM">BLUE TEAM</option>
                    <option value="GRC">GRC</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>TYPE</label>
                  <select name="type" value={form.type} onChange={handleChange} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                    <option value="Leçon">Leçon</option>
                    <option value="Exercice">Exercice</option>
                    <option value="Quiz">Quiz</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>SKILL-TAGS (séparés par des virgules)</label>
                <input name="tags" value={form.tags} onChange={handleChange} placeholder="Ex : http-basics, owasp-top10" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>CONTENU / DESCRIPTION</label>
                <textarea name="contenu" value={form.contenu} onChange={handleChange} placeholder="Décrivez le contenu de la leçon…" rows={4} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Inter, sans-serif' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button onClick={() => { setShowModal(false); setForm(MODAL_INIT); }} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#8A93A6', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  Annuler
                </button>
                <button onClick={handleSubmit} disabled={saving || !form.titre || !form.parcours} style={{ ...btnPrimary, opacity: saving || !form.titre || !form.parcours ? 0.6 : 1 }}>
                  {saving ? 'Enregistrement…' : 'Créer la leçon'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
