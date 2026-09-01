import React from 'react';
import AdminSidebar from './AdminSidebar';

const STATS = [
  { label: 'INSCRITS ACTIFS', value: '429', sub: '+18 cette semaine', color: '#ffffff', subColor: '#6a9e6a' },
  { label: 'PAIEMENTS DU MOIS', value: '€ 14 280', sub: '34 transactions', color: '#6a9e6a', subColor: '#8A93A6' },
  { label: 'TAUX COMPLÉTION', value: '62 %', sub: 'moyenne globale', color: '#4a7fc2', subColor: '#8A93A6' },
  { label: 'LIVRABLES EN ATTENTE', value: '14', sub: 'dont 6 > 48h', color: '#c0505a', subColor: '#c9a94e', badge: 14 },
];

const FAMILIES = [
  { label: 'RED TEAM', count: 142, pct: 67, color: '#c0505a' },
  { label: 'BLUE TEAM', count: 198, pct: 58, color: '#4a7fc2' },
  { label: 'GRC', count: 89, pct: 74, color: '#c9a94e' },
];

const LIVRABLES = [
  { name: 'Moussa Diallo', course: 'Pentest Web', family: 'RED TEAM', time: 'Il y a 3h', status: 'En attente', statusColor: '#c9a94e', familyColor: '#c0505a', familyBg: 'rgba(192,80,90,0.15)' },
  { name: 'Ama Owusu', course: 'SOC Analyst L1', family: 'BLUE TEAM', time: 'Il y a 5h', status: 'En attente', statusColor: '#c9a94e', familyColor: '#4a7fc2', familyBg: 'rgba(74,127,194,0.15)' },
  { name: 'Ibrahim Touré', course: 'ISO 27001 Lead', family: 'GRC', time: 'Il y a 8h', status: 'En attente', statusColor: '#c9a94e', familyColor: '#c9a94e', familyBg: 'rgba(201,169,78,0.15)' },
  { name: 'Fatou Sow', course: 'Ethical Hacking', family: 'RED TEAM', time: 'Il y a 1j', status: 'En cours', statusColor: '#4a7fc2', familyColor: '#c0505a', familyBg: 'rgba(192,80,90,0.15)' },
];

const ACTIVITE = [
  { time: '09:41', text: 'Kofi Mensah a soumis son rapport Pentest Web', color: '#c0505a' },
  { time: '09:12', text: 'Certification émise — Ama Owusu, SOC Analyst L1', color: '#6a9e6a' },
  { time: '08:55', text: 'Nouveau paiement Stripe — Ibrahim Touré · ISO 27001', color: '#4a7fc2' },
  { time: '08:30', text: 'Livrable validé — Fatou Sow, Ethical Hacking', color: '#6a9e6a' },
  { time: '07:59', text: 'Inscription — Jean-Luc Martin, Pentest Web (FR)', color: '#c9a94e' },
];

const PAIEMENTS = [
  { method: 'Stripe', amount: '€ 189', status: 'Payé', statusColor: '#6a9e6a', statusBg: 'rgba(106,158,106,0.15)' },
  { method: 'MTN Mobile Money', amount: 'XOF 124 000', status: 'Payé', statusColor: '#6a9e6a', statusBg: 'rgba(106,158,106,0.15)' },
  { method: 'Wave', amount: 'XOF 89 000', status: 'Payé', statusColor: '#6a9e6a', statusBg: 'rgba(106,158,106,0.15)' },
  { method: 'PayPal', amount: '€ 320', status: 'Remboursé', statusColor: '#8A93A6', statusBg: 'rgba(138,147,166,0.15)' },
  { method: 'Stripe', amount: '€ 95', status: 'Échoué', statusColor: '#c0505a', statusBg: 'rgba(192,80,90,0.15)' },
];

const card = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' };

const AdminOverview = () => (
  <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #080d1a 0%, #0d0f2b 100%)', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
    <AdminSidebar />
    <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: '13px', color: '#8A93A6', marginTop: '4px' }}>Vue d'ensemble de la plateforme — 20 août 2026</p>
        </div>
        <button style={{ background: '#3b6ea5', border: '1px solid rgba(59,110,165,0.4)', color: '#fff', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Exporter</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ ...card, position: 'relative' }}>
            {s.badge && <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#c0505a', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.badge}</div>}
            <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em', color: '#8A93A6', marginBottom: '12px' }}>{s.label}</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: s.subColor, marginTop: '6px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '16px', marginBottom: '24px' }}>
        <div style={card}>
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

        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', color: '#8A93A6' }}>LIVRABLES RÉCENTS</span>
            <button style={{ background: '#3b6ea5', border: 'none', color: '#fff', borderRadius: '6px', padding: '6px 12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>Voir tout</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['APPRENANT','FAMILLE','SOUMIS','STATUT'].map(h => <th key={h} style={{ fontSize: '10px', color: '#8A93A6', fontWeight: '700', letterSpacing: '0.08em', textAlign: 'left', paddingBottom: '10px' }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {LIVRABLES.map((l, i) => (
                <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 0' }}><div style={{ fontSize: '13px', color: '#fff' }}>{l.name}</div><div style={{ fontSize: '11px', color: '#8A93A6' }}>{l.course}</div></td>
                  <td style={{ padding: '10px 8px' }}><span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', color: l.familyColor, background: l.familyBg }}>{l.family}</span></td>
                  <td style={{ padding: '10px 8px', fontSize: '12px', color: '#8A93A6' }}>{l.time}</td>
                  <td style={{ padding: '10px 0', fontSize: '12px', fontWeight: '600', color: l.statusColor }}>{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={card}>
          <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', color: '#8A93A6', marginBottom: '16px' }}>ACTIVITÉ RÉCENTE</div>
          {ACTIVITE.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: i < ACTIVITE.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ width: '3px', borderRadius: '2px', background: a.color, alignSelf: 'stretch', minHeight: '36px', flexShrink: 0 }} />
              <div><div style={{ fontSize: '11px', color: '#8A93A6', marginBottom: '3px' }}>{a.time}</div><div style={{ fontSize: '13px', color: '#fff' }}>{a.text}</div></div>
            </div>
          ))}
        </div>

        <div style={card}>
          <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', color: '#8A93A6', marginBottom: '16px' }}>PAIEMENTS AUJOURD'HUI</div>
          {PAIEMENTS.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < PAIEMENTS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div><div style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>{p.method}</div><div style={{ fontSize: '13px', color: '#6a9e6a', fontWeight: '700', marginTop: '2px' }}>{p.amount}</div></div>
              <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', color: p.statusColor, background: p.statusBg }}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default AdminOverview;