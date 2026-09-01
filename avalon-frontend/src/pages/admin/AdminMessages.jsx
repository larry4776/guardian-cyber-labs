import React, { useState } from 'react';
import { Download, CreditCard, Smartphone, Waves } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const STATS = [
  { icon: CreditCard, label: 'STRIPE', tx: 28, montant: '€ 9 842', color: '#4a7fc2' },
  { icon: null, label: 'PAYPAL', tx: 12, montant: '€ 2 340', color: '#22d3ee', isPaypal: true },
  { icon: Smartphone, label: 'MTN MOBILE MONEY', tx: 18, montant: 'XOF 8.2M', color: '#c9a94e' },
  { icon: Waves, label: 'WAVE', tx: 14, montant: 'XOF 5.7M', color: '#6a9e6a' },
];

const TRANSACTIONS = [
  { id: 'TXN-8821', user: 'Moussa Diallo', parcours: 'Pentest Web', methode: 'Stripe', montant: '€ 189', date: '20 août 2026', statut: 'Payé' },
  { id: 'TXN-8820', user: 'Fatou Sow', parcours: 'Threat Hunting', methode: 'Wave', montant: 'XOF 149 000', date: '20 août 2026', statut: 'Payé' },
  { id: 'TXN-8819', user: 'Kofi Mensah', parcours: 'Ethical Hacking', methode: 'MTN Mobile Money', montant: 'XOF 199 000', date: '19 août 2026', statut: 'Payé' },
  { id: 'TXN-8818', user: 'Jean-Luc Martin', parcours: 'RGPD & Conformité', methode: 'PayPal', montant: '€ 99', date: '19 août 2026', statut: 'Remboursé' },
  { id: 'TXN-8817', user: 'Ama Owusu', parcours: 'SOC Analyst L1', methode: 'Stripe', montant: '€ 149', date: '18 août 2026', statut: 'Payé' },
  { id: 'TXN-8816', user: 'Ibrahim Touré', parcours: 'ISO 27001 Lead', methode: 'Stripe', montant: '€ 295', date: '18 août 2026', statut: 'Payé' },
  { id: 'TXN-8815', user: 'Seun Adeyemi', parcours: 'AD Attacks', methode: 'PayPal', montant: '€ 219', date: '17 août 2026', statut: 'Échoué' },
];

const FILTRES_METHODE = ['Toutes méthodes', 'Stripe', 'PayPal', 'MTN Mobile Money', 'Wave'];
const FILTRES_PERIODE = ['7j', '30j', '90j'];

const card = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' };

const statutStyle = (s) => {
  if (s === 'Payé') return { color: '#6a9e6a', bg: 'rgba(106,158,106,0.15)' };
  if (s === 'Remboursé') return { color: '#8A93A6', bg: 'rgba(138,147,166,0.15)' };
  return { color: '#c0505a', bg: 'rgba(192,80,90,0.15)' };
};

const AdminMessages = () => {
  const [activeMethode, setActiveMethode] = useState('Toutes méthodes');
  const [activePeriode, setActivePeriode] = useState('30j');

  const filtered = TRANSACTIONS.filter(t =>
    activeMethode === 'Toutes méthodes' || t.methode === activeMethode
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #080d1a 0%, #0d0f2b 100%)', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>Paiements & Transactions</h1>
            <p style={{ fontSize: '13px', color: '#8A93A6', marginTop: '4px' }}>Vue par méthode de paiement</p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            <Download size={14} /> Exporter
          </button>
        </div>

        {/* Cartes stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ ...card, padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', color: '#8A93A6', fontWeight: '600' }}>{s.tx} tx</span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                {s.isPaypal
                  ? <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#0070ba', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '900', color: '#fff' }}>P</div>
                  : <s.icon size={28} color={s.color} />
                }
              </div>
              <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#8A93A6', marginBottom: '8px' }}>{s.label}</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: s.color }}>{s.montant}</div>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {FILTRES_METHODE.map(f => (
              <button key={f} onClick={() => setActiveMethode(f)} style={{
                padding: '8px 14px', borderRadius: '8px',
                background: activeMethode === f ? '#3b6ea5' : 'rgba(255,255,255,0.06)',
                border: activeMethode === f ? '1px solid rgba(59,110,165,0.4)' : '1px solid rgba(255,255,255,0.1)',
                color: activeMethode === f ? '#fff' : '#8A93A6',
                fontSize: '13px', fontWeight: activeMethode === f ? '600' : '400', cursor: 'pointer',
              }}>{f}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {FILTRES_PERIODE.map(p => (
              <button key={p} onClick={() => setActivePeriode(p)} style={{
                padding: '8px 14px', borderRadius: '8px',
                background: activePeriode === p ? '#3b6ea5' : 'rgba(255,255,255,0.06)',
                border: activePeriode === p ? '1px solid rgba(59,110,165,0.4)' : '1px solid rgba(255,255,255,0.1)',
                color: activePeriode === p ? '#fff' : '#8A93A6',
                fontSize: '13px', fontWeight: activePeriode === p ? '600' : '400', cursor: 'pointer',
              }}>{p}</button>
            ))}
          </div>
        </div>

        {/* Tableau */}
        <div style={{ ...card, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['ID','UTILISATEUR','PARCOURS','MÉTHODE','MONTANT','DATE','STATUT',''].map((h,i) => (
                  <th key={i} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#8A93A6' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const s = statutStyle(t.statut);
                return (
                  <tr key={i} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#4a7fc2' }}>{t.id}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#fff' }}>{t.user}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#fff' }}>{t.parcours}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8A93A6' }}>{t.methode}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: t.statut === 'Échoué' ? '#c0505a' : '#6a9e6a' }}>{t.montant}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8A93A6' }}>{t.date}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', color: s.color, background: s.bg }}>{t.statut}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button style={{ fontSize: '12px', fontWeight: '600', padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer' }}>Détail</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;