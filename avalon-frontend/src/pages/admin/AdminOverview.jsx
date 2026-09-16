import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import { DASHBOARD_STATS, ACTIVITE, PAIEMENTS_JOUR } from '../../data/courses';
import { LIVRABLES } from '../../data/submissions';
import { cardPadded, btnPrimary } from '../../styles/theme';

const FAMILIES = [
  { label: 'RED TEAM', count: 142, pct: 67, color: '#c0505a' },
  { label: 'BLUE TEAM', count: 198, pct: 58, color: '#4a7fc2' },
  { label: 'GRC', count: 89, pct: 74, color: '#c9a94e' },
];

const card = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
};

const AdminOverview = () => (
  <div style={{
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #080d1a 0%, #0d0f2b 100%)',
    color: '#fff',
    fontFamily: 'Inter, sans-serif',
  }}>
    <AdminSidebar />

    {/* Zone droite */}
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

      {/* TopBar fixe */}
      <AdminTopBar
        title="Dashboard"
        subtitle="Vue d'ensemble de la plateforme — 20 août 2026"
      >
        <button style={btnPrimary}>Exporter</button>
      </AdminTopBar>

      {/* Contenu scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
          {DASHBOARD_STATS.map((s, i) => (
            <div key={i} style={{ ...cardPadded, position: 'relative' }}>
              {s.badge && (
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#c0505a', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.badge}</div>
              )}
              <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em', color: '#8A93A6', marginBottom: '12px' }}>{s.label}</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: s.subColor, marginTop: '6px' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Progression + Livrables */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '16px', marginBottom: '24px' }}>
          <div style={cardPadded}>
            <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', color: '#8A93A6', marginBottom: '20px' }}>PROGRESSION PAR FAMILLE</div>
            {FAMILIES.map((f, i) => (
              <div key={i} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: f.color }}>{f.label}</span>
                  <span style={{ fontSize: '12px', color: '#8A93A6' }}>{f.count} inscrits</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '6px' }}>
                  <div style={{ width: `${f.pct}%`, height: '100%', background: f.color, borderRadius: '4px' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#8A93A6', marginTop: '4px', textAlign: 'right' }}>{f.pct}%</div>
              </div>
            ))}
          </div>

          <div style={cardPadded}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', color: '#8A93A6' }}>LIVRABLES RÉCENTS</span>
              <button style={{ background: '#3b6df0', border: 'none', color: '#fff', borderRadius: '6px', padding: '6px 12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>Voir tout</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['APPRENANT', 'FAMILLE', 'SOUMIS', 'STATUT'].map(h => (
                    <th key={h} style={{ fontSize: '10px', color: '#8A93A6', fontWeight: '700', letterSpacing: '0.08em', textAlign: 'left', paddingBottom: '10px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LIVRABLES.slice(0, 4).map((l, i) => (
                  <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px 0' }}>
                      <div style={{ fontSize: '13px', color: '#fff' }}>{l.nom}</div>
                      <div style={{ fontSize: '11px', color: '#8A93A6' }}>{l.parcours}</div>
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', color: l.familleColor, background: l.familleBg }}>{l.famille}</span>
                    </td>
                    <td style={{ padding: '10px 8px', fontSize: '12px', color: '#8A93A6' }}>{l.soumis}</td>
                    <td style={{ padding: '10px 0', fontSize: '12px', fontWeight: '600', color: l.statut === 'En cours' ? '#4a7fc2' : '#c9a94e' }}>{l.statut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activité + Paiements */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={cardPadded}>
            <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', color: '#8A93A6', marginBottom: '16px' }}>ACTIVITÉ RÉCENTE</div>
            {ACTIVITE.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: i < ACTIVITE.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ width: '3px', borderRadius: '2px', background: a.color, alignSelf: 'stretch', minHeight: '36px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '11px', color: '#8A93A6', marginBottom: '3px' }}>{a.time}</div>
                  <div style={{ fontSize: '13px', color: '#fff' }}>{a.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={cardPadded}>
            <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', color: '#8A93A6', marginBottom: '16px' }}>PAIEMENTS AUJOURD'HUI</div>
            {PAIEMENTS_JOUR.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < PAIEMENTS_JOUR.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>{p.method}</div>
                  <div style={{ fontSize: '13px', color: '#6a9e6a', fontWeight: '700', marginTop: '2px' }}>{p.amount}</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', color: p.statusColor, background: p.statusBg }}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AdminOverview;