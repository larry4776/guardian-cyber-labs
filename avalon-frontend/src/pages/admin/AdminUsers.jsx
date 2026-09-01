import React, { useState } from 'react';
import { ChevronDown, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const LIVRABLES = [
  { id: '2847', nom: 'Moussa Diallo', parcours: 'Pentest Web', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', type: 'Rapport PDF', soumis: '3h ago', attente: '3h', enRetard: false, statut: 'En attente' },
  { id: '2846', nom: 'Ama Owusu', parcours: 'SOC Analyst L1', famille: 'BLUE TEAM', familleColor: '#4a7fc2', familleBg: 'rgba(74,127,194,0.15)', type: 'Scénario décisionnel', soumis: '5h ago', attente: '5h', enRetard: false, statut: 'En attente' },
  { id: '2845', nom: 'Ibrahim Touré', parcours: 'ISO 27001 Lead', famille: 'GRC', familleColor: '#c9a94e', familleBg: 'rgba(201,169,78,0.15)', type: 'Fichier DOCX', soumis: '8h ago', attente: '8h', enRetard: false, statut: 'En attente' },
  { id: '2844', nom: 'Kofi Mensah', parcours: 'Ethical Hacking', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', type: 'Terminal simulé', soumis: '1j ago', attente: '26h', enRetard: false, statut: 'En cours' },
  { id: '2843', nom: 'Fatou Sow', parcours: 'Threat Hunting', famille: 'BLUE TEAM', familleColor: '#4a7fc2', familleBg: 'rgba(74,127,194,0.15)', type: 'Rapport PDF', soumis: '2j ago', attente: '52h', enRetard: true, statut: 'En attente' },
  { id: '2842', nom: 'Jean-Luc Martin', parcours: 'RGPD & Conformité', famille: 'GRC', familleColor: '#c9a94e', familleBg: 'rgba(201,169,78,0.15)', type: 'Fichier DOCX', soumis: '2j ago', attente: '49h', enRetard: true, statut: 'En attente' },
  { id: '2841', nom: 'Aissatou Bah', parcours: 'Pentest Web', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', type: 'Rapport PDF', soumis: '3j ago', attente: '74h', enRetard: true, statut: 'En attente' },
  { id: '2840', nom: 'Seun Adeyemi', parcours: 'Active Directory', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', type: 'Terminal simulé', soumis: '1h ago', attente: '1h', enRetard: false, statut: 'En attente' },
];

const FILTRES = ['Tous', 'Red Team', 'Blue Team', 'GRC'];

const card = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
};

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
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: 'linear-gradient(135deg, #080d1a 0%, #0d0f2b 100%)',
      color: '#fff', fontFamily: 'Inter, sans-serif',
    }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>File de correction</h1>
          <p style={{ fontSize: '13px', color: '#8A93A6', marginTop: '4px' }}>
            7 livrables en attente · <span style={{ color: '#c0505a' }}>3 dépassent 48h</span>
          </p>
        </div>

        {/* Filtres */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {FILTRES.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{
                padding: '8px 16px', borderRadius: '8px',
                background: activeFilter === f ? '#3b6ea5' : 'rgba(255,255,255,0.06)',
                border: activeFilter === f ? '1px solid rgba(59,110,165,0.4)' : '1px solid rgba(255,255,255,0.1)',
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
              <ChevronDown size={14} style={{
                position: 'absolute', right: '8px', top: '50%',
                transform: 'translateY(-50%)', color: '#8A93A6', pointerEvents: 'none',
              }} />
            </div>
          </div>
        </div>

        {/* Tableau */}
        <div style={{ ...card, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['', 'APPRENANT', 'FAMILLE', 'TYPE', 'SOUMIS', 'ATTENTE', 'STATUT', 'ACTION'].map((h, i) => (
                  <th key={i} style={{
                    padding: '14px 16px', textAlign: 'left',
                    fontSize: '10px', fontWeight: '700',
                    letterSpacing: '0.1em', color: '#8A93A6',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr key={i} style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  background: l.enRetard ? 'rgba(192,80,90,0.05)' : 'transparent',
                }}>

                  {/* Barre latérale retard */}
                  <td style={{ padding: 0, width: '3px' }}>
                    <div style={{
                      width: '3px',
                      background: l.enRetard ? '#c0505a' : 'transparent',
                      minHeight: '56px',
                    }} />
                  </td>

                  {/* Apprenant */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{l.nom}</div>
                    <div style={{ fontSize: '11px', color: '#8A93A6', marginTop: '2px' }}>{l.parcours}</div>
                  </td>

                  {/* Famille */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '10px', fontWeight: '700', padding: '4px 8px',
                      borderRadius: '4px', color: l.familleColor, background: l.familleBg,
                    }}>{l.famille}</span>
                  </td>

                  {/* Type */}
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8A93A6' }}>{l.type}</td>

                  {/* Soumis */}
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8A93A6' }}>{l.soumis}</td>

                  {/* Attente */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {l.enRetard && <AlertTriangle size={13} color="#c0505a" />}
                      <span style={{
                        fontSize: '13px', fontWeight: '600',
                        color: l.enRetard ? '#c0505a' : '#c9a94e',
                      }}>{l.attente}</span>
                    </div>
                  </td>

                  {/* Statut */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px',
                      color: l.statut === 'En cours' ? '#4a7fc2' : '#c9a94e',
                      background: l.statut === 'En cours' ? 'rgba(74,127,194,0.15)' : 'rgba(201,169,78,0.15)',
                    }}>{l.statut}</span>
                  </td>

                  {/* Action */}
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => navigate(`/admin/correction/${l.id}`)}
                      style={{
                        fontSize: '12px', fontWeight: '600', padding: '7px 14px',
                        borderRadius: '6px', border: '1px solid rgba(59,110,165,0.4)',
                        background: '#3b6ea5', color: '#fff', cursor: 'pointer',
                      }}>Corriger</button>
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