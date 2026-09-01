import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';

const PARCOURS = [
  { nom: 'Pentest Web', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', niveau: 'Intermédiaire', tarif: '€ 189', inscrits: 142 },
  { nom: 'Ethical Hacking', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', niveau: 'Avancé', tarif: '€ 249', inscrits: 78 },
  { nom: 'Active Directory Attacks', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', niveau: 'Avancé', tarif: '€ 219', inscrits: 55 },
  { nom: 'SOC Analyst L1', famille: 'BLUE TEAM', familleColor: '#4a7fc2', familleBg: 'rgba(74,127,194,0.15)', niveau: 'Débutant', tarif: '€ 149', inscrits: 198 },
  { nom: 'Analyse Forensique Réseau', famille: 'BLUE TEAM', familleColor: '#4a7fc2', familleBg: 'rgba(74,127,194,0.15)', niveau: 'Intermédiaire', tarif: '€ 179', inscrits: 89 },
  { nom: 'Threat Hunting', famille: 'BLUE TEAM', familleColor: '#4a7fc2', familleBg: 'rgba(74,127,194,0.15)', niveau: 'Avancé', tarif: '€ 229', inscrits: 44 },
  { nom: 'ISO 27001 Lead Implementer', famille: 'GRC', familleColor: '#c9a94e', familleBg: 'rgba(201,169,78,0.15)', niveau: 'Intermédiaire', tarif: '€ 295', inscrits: 89 },
  { nom: 'RGPD & Conformité', famille: 'GRC', familleColor: '#c9a94e', familleBg: 'rgba(201,169,78,0.15)', niveau: 'Débutant', tarif: '€ 99', inscrits: 112 },
  { nom: 'Gestion des Risques ISO 27005', famille: 'GRC', familleColor: '#c9a94e', familleBg: 'rgba(201,169,78,0.15)', niveau: 'Avancé', tarif: '€ 219', inscrits: 67 },
];

const FAMILLES_ADD = [
  { nom: 'Cloud Security', desc: 'AWS, Azure, GCP — sécurisation infrastructure cloud' },
  { nom: 'DevSecOps', desc: 'CI/CD sécurisé, shift-left, SAST/DAST' },
  { nom: 'Forensic / DFIR', desc: 'Investigation numérique et réponse à incident' },
  { nom: 'Threat Intelligence', desc: "CTI, OSINT, attribution d'acteurs" },
  { nom: 'Mobile / IoT Security', desc: 'Android, iOS, firmware hacking' },
  { nom: 'Cryptographie appliquée', desc: 'PKI, TLS, attaques cryptographiques' },
];

const Toggle = ({ on, onToggle }) => (
  <div onClick={onToggle} style={{ width: '36px', height: '20px', borderRadius: '10px', background: on ? '#3b6ea5' : 'rgba(255,255,255,0.15)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
    <div style={{ position: 'absolute', top: '3px', left: on ? '18px' : '3px', width: '14px', height: '14px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
  </div>
);

const card = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' };

const AdminSubmissions = () => {
  const [toggles, setToggles] = useState(FAMILLES_ADD.map(() => true));
  const flip = (i) => setToggles(prev => prev.map((v, idx) => idx === i ? !v : v));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #080d1a 0%, #0d0f2b 100%)', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>Parcours & Familles</h1>
            <p style={{ fontSize: '13px', color: '#8A93A6', marginTop: '4px' }}>9 parcours actifs — gestion des tarifs, niveaux et disponibilité</p>
          </div>
          <button style={{ background: '#3b6ea5', border: '1px solid rgba(59,110,165,0.4)', color: '#fff', borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>+ Nouveau parcours</button>
        </div>

        {/* Tableau */}
        <div style={{ ...card, overflow: 'hidden', marginBottom: '32px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['PARCOURS','FAMILLE','NIVEAU','TARIF','INSCRITS','STATUT',''].map((h,i) => (
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
                      <button style={{ fontSize: '12px', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(59,110,165,0.3)', background: 'rgba(59,110,165,0.1)', color: '#4a7fc2', cursor: 'pointer' }}>Modules</button>
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
  );
};

export default AdminSubmissions;