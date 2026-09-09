import React, { useState } from 'react';
import { ChevronDown, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { LIVRABLES } from '../../data/submissions';
import { pageWrapper, mainContent, card } from '../../styles/theme';

const FILTRES = ['Tous', 'Red Team', 'Blue Team', 'GRC'];

const AdminUsers = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Tous');

  const filtered = LIVRABLES.filter(l => {
    if (activeFilter === 'Tous') return true;
    if (activeFilter === 'Red Team') return l.famille === 'RED TEAM';
    if (activeFilter === 'Blue Team') return l.famille === 'BLUE TEAM';
    if (activeFilter === 'GRC') return l.famille === 'GRC';
    return true;
  });

  return (
    <div style={pageWrapper}>
      <AdminSidebar />
      <div style={mainContent}>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>File de correction</h1>
          <p style={{ fontSize: '13px', color: '#8A93A6', marginTop: '4px' }}>
            7 livrables en attente · <span style={{ color: '#c0505a' }}>3 dépassent 48h</span>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {FILTRES.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{
                padding: '8px 16px', borderRadius: '8px',
                background: activeFilter === f ? '#3b6df0' : 'rgba(255,255,255,0.06)',
                border: activeFilter === f ? '1px solid rgba(59,109,240,0.4)' : '1px solid rgba(255,255,255,0.1)',
                color: activeFilter === f ? '#fff' : '#8A93A6',
                fontSize: '13px', fontWeight: activeFilter === f ? '600' : '400',
                cursor: 'pointer',
              }}>{f}</button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#8A93A6' }}>Trier par</span>
            <div style={{ position: 'relative' }}>
              <select style={{
                appearance: 'none', padding: '8px 32px 8px 12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', color: '#fff',
                fontSize: '13px', cursor: 'pointer', outline: 'none',
              }}>
                <option>Date de soumission</option>
                <option>Durée d'attente</option>
                <option>Famille</option>
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#8A93A6', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        <div style={{ ...card, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['', 'APPRENANT', 'FAMILLE', 'TYPE', 'SOUMIS', 'ATTENTE', 'STATUT', 'ACTION'].map((h, i) => (
                  <th key={i} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#8A93A6' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr key={i} style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  background: l.enRetard ? 'rgba(192,80,90,0.05)' : 'transparent',
                }}>
                  <td style={{ padding: 0, width: '3px' }}>
                    <div style={{ width: '3px', background: l.enRetard ? '#c0505a' : 'transparent', minHeight: '56px' }} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{l.nom}</div>
                    <div style={{ fontSize: '11px', color: '#8A93A6', marginTop: '2px' }}>{l.parcours}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', color: l.familleColor, background: l.familleBg }}>{l.famille}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8A93A6' }}>{l.type}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8A93A6' }}>{l.soumis}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {l.enRetard && <AlertTriangle size={13} color="#c0505a" />}
                      <span style={{ fontSize: '13px', fontWeight: '600', color: l.enRetard ? '#c0505a' : '#c9a94e' }}>{l.attente}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px',
                      color: l.statut === 'En cours' ? '#4a7fc2' : '#c9a94e',
                      background: l.statut === 'En cours' ? 'rgba(74,127,194,0.15)' : 'rgba(201,169,78,0.15)',
                    }}>{l.statut}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => navigate(`/admin/correction/${l.id}`)}
                      style={{ fontSize: '12px', fontWeight: '600', padding: '7px 14px', borderRadius: '6px', border: '1px solid rgba(59,109,240,0.4)', background: '#3b6df0', color: '#fff', cursor: 'pointer' }}>
                      Corriger
                    </button>
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

export default AdminUsers;
