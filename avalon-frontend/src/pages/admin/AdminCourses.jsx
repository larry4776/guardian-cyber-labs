import React, { useState } from 'react';
import { Search, BookOpen, Zap, HelpCircle, ChevronDown } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const TABS = ['Leçons', 'Quiz', 'Exercices'];

const CONTENU = [
  { titre: 'Introduction au Pentest Web', parcours: 'Pentest Web', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', type: 'Leçon', typeIcon: 'book', tags: ['http-basics', 'owasp-top10'] },
  { titre: 'Injection SQL avancée', parcours: 'Pentest Web', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', type: 'Exercice', typeIcon: 'zap', tags: ['sql-injection', 'bypass'] },
  { titre: 'XSS – Reflected & Stored', parcours: 'Pentest Web', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', type: 'Quiz', typeIcon: 'quiz', tags: ['xss', 'dom-xss'] },
  { titre: "Analyse SIEM – corrélation d'événements", parcours: 'SOC Analyst L1', famille: 'BLUE TEAM', familleColor: '#4a7fc2', familleBg: 'rgba(74,127,194,0.15)', type: 'Exercice', typeIcon: 'zap', tags: ['siem', 'log-analysis'] },
  { titre: 'Gestion des risques ISO 27005', parcours: 'ISO 27001 Lead', famille: 'GRC', familleColor: '#c9a94e', familleBg: 'rgba(201,169,78,0.15)', type: 'Leçon', typeIcon: 'book', tags: ['risk-management', 'iso27005'] },
];

const TypeIcon = ({ type }) => {
  if (type === 'book') return <BookOpen size={14} />;
  if (type === 'zap') return <Zap size={14} />;
  return <HelpCircle size={14} />;
};

const card = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' };

const AdminCourses = () => {
  const [activeTab, setActiveTab] = useState('Leçons');
  const [search, setSearch] = useState('');

  const filtered = CONTENU.filter(c =>
    c.titre.toLowerCase().includes(search.toLowerCase()) ||
    c.parcours.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #080d1a 0%, #0d0f2b 100%)', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>Gestion du contenu</h1>
            <p style={{ fontSize: '13px', color: '#8A93A6', marginTop: '4px' }}>Leçons, quiz et exercices</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Importer</button>
            <button style={{ background: '#3b6ea5', border: '1px solid rgba(59,110,165,0.4)', color: '#fff', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>+ Nouvelle leçon</button>
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

        {/* Recherche + filtre */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#8A93A6' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une leçon…"
              style={{ width: '100%', paddingLeft: '40px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
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
                {['TITRE','FAMILLE','TYPE','SKILL-TAGS','STATUT',''].map((h,i) => (
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
    </div>
  );
};

export default AdminCourses;