import React, { useState } from 'react';
import { Search, Download, ChevronDown } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { USERS } from '../../data/users';
import { pageWrapper, mainContent, card, btnPrimary } from '../../styles/theme';

const AdminPayments = () => {
  const [search, setSearch] = useState('');

  const filtered = USERS.filter(u =>
    u.nom.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={pageWrapper}>
      <AdminSidebar />
      <div style={mainContent}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>Utilisateurs & Inscrits</h1>
            <p style={{ fontSize: '13px', color: '#8A93A6', marginTop: '4px' }}>
              8 inscrits · <span style={{ color: '#6a9e6a' }}>7 actifs</span>
            </p>
          </div>
          <button style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={14} /> Exporter CSV
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A93A6' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un utilisateur…"
              style={{
                width: '100%', paddingLeft: '38px', paddingRight: '12px',
                paddingTop: '9px', paddingBottom: '9px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', color: '#fff',
                fontSize: '13px', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          {['Toutes les familles', 'Tous les statuts', 'Toutes les langues'].map(label => (
            <div key={label} style={{ position: 'relative' }}>
              <select style={{
                appearance: 'none', padding: '9px 32px 9px 12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', color: '#fff',
                fontSize: '13px', cursor: 'pointer', outline: 'none',
              }}>
                <option>{label}</option>
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#8A93A6', pointerEvents: 'none' }} />
            </div>
          ))}
        </div>

        <div style={{ ...card, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['UTILISATEUR', 'FAMILLE', 'PARCOURS', 'PROGRESSION', 'PAIEMENT', 'LANGUE', 'STATUT', ''].map((h, i) => (
                  <th key={i} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#8A93A6' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={i} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '50%',
                        background: u.couleurAvatar, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: '700', color: '#fff',
                      }}>{u.initiale}</div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{u.nom}</div>
                        <div style={{ fontSize: '11px', color: '#8A93A6', marginTop: '2px' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', color: u.familleColor, background: u.familleBg }}>{u.famille}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#fff' }}>{u.parcours}</td>
                  <td style={{ padding: '14px 16px', minWidth: '120px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '6px' }}>
                        <div style={{ width: `${u.progression}%`, height: '100%', background: u.familleColor, borderRadius: '4px' }} />
                      </div>
                      <span style={{ fontSize: '12px', color: '#fff', fontWeight: '600', minWidth: '30px' }}>{u.progression}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px',
                      color: u.paiement === 'Payé' ? '#6a9e6a' : '#c0505a',
                      background: u.paiement === 'Payé' ? 'rgba(106,158,106,0.15)' : 'rgba(192,80,90,0.15)',
                    }}>{u.paiement}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8A93A6' }}>{u.langue}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px',
                      color: u.statut === 'Actif' ? '#6a9e6a' : '#8A93A6',
                      background: u.statut === 'Actif' ? 'rgba(106,158,106,0.15)' : 'rgba(138,147,166,0.15)',
                    }}>{u.statut}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button style={{ fontSize: '12px', fontWeight: '600', padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer' }}>Voir</button>
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

export default AdminPayments;
