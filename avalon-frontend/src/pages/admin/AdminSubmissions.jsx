import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import { PARCOURS, FAMILLES_ADD } from '../../data/courses';
import { card, btnPrimary } from '../../styles/theme';

const Toggle = ({ on, onToggle }) => (
  <div onClick={onToggle} style={{
    width: '36px', height: '20px', borderRadius: '10px',
    background: on ? '#3b6df0' : 'rgba(255,255,255,0.15)',
    cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0,
  }}>
    <div style={{
      position: 'absolute', top: '3px',
      left: on ? '18px' : '3px',
      width: '14px', height: '14px', borderRadius: '50%',
      background: '#fff', transition: 'left 0.2s',
    }} />
  </div>
);

const AdminSubmissions = () => {
  const [toggles, setToggles] = useState(FAMILLES_ADD.map(() => true));
  const flip = (i) => setToggles(prev => prev.map((v, idx) => idx === i ? !v : v));

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: 'linear-gradient(135deg, #080d1a 0%, #0d0f2b 100%)',
      color: '#fff', fontFamily: 'Inter, sans-serif',
    }}>
      <AdminSidebar />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

        <AdminTopBar
          title="Parcours & Familles"
          subtitle="9 parcours actifs — gestion des tarifs, niveaux et disponibilité"
        >
          <button style={btnPrimary}>+ Nouveau parcours</button>
        </AdminTopBar>

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>

          {/* Tableau */}
          <div style={{ ...card, overflow: 'hidden', marginBottom: '32px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {['PARCOURS', 'FAMILLE', 'NIVEAU', 'TARIF', 'INSCRITS', 'STATUT', ''].map((h, i) => (
                    <th key={i} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#8A93A6' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PARCOURS.map((p, i) => (
                  <tr key={i} style={{ borderBottom: i < PARCOURS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#fff' }}>{p.nom}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', color: p.familleColor, background: p.familleBg }}>{p.famille}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8A93A6' }}>{p.niveau}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: '#6a9e6a' }}>{p.tarif}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#fff' }}>{p.inscrits}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', color: '#6a9e6a', background: 'rgba(106,158,106,0.15)' }}>Actif</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{ fontSize: '12px', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer' }}>Éditer</button>
                        <button style={{ fontSize: '12px', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(59,109,240,0.3)', background: 'rgba(59,109,240,0.1)', color: '#4a7fc2', cursor: 'pointer' }}>Modules</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Familles additionnelles */}
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', margin: 0 }}>FAMILLES ADDITIONNELLES</h2>
            <p style={{ fontSize: '13px', color: '#8A93A6', marginTop: '4px', marginBottom: '16px' }}>
              Activez "Bientôt disponible" pour les afficher sur la plateforme publique
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {FAMILLES_ADD.map((f, i) => (
                <div key={i} style={{ ...card, padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{f.nom}</span>
                    <Toggle on={toggles[i]} onToggle={() => flip(i)} />
                  </div>
                  <p style={{ fontSize: '12px', color: '#8A93A6', margin: 0, lineHeight: '1.5' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubmissions;