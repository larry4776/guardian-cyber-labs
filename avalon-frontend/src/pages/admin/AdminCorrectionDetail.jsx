import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, X, Check } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const CRITERES_INIT = [
  { label: "Identification correcte des vecteurs d'injection", poids: 20, coche: false },
  { label: "Payload de bypass WAF documenté", poids: 15, coche: false },
  { label: "Proof of concept fonctionnel inclus", poids: 20, coche: true },
  { label: "Recommandations de remédiation pertinentes", poids: 20, coche: false },
  { label: "Rapport structuré (exec summary + technique)", poids: 15, coche: true },
  { label: "Screenshots et logs annotés", poids: 5, coche: false },
  { label: "CVSS calculé correctement", poids: 5, coche: false },
];

const VULNERABILITES = [
  { cve: 'CVE-2024-3891', type: 'SQLi', lieu: 'POST /api/users', cvss: 9.8, critique: true },
  { cve: 'CVE-2024-2201', type: 'XSS Stored', lieu: '/comments', cvss: 8.2, critique: true },
  { cve: 'CVE-2024-1501', type: 'IDOR', lieu: '/api/docs/:id', cvss: 7.5, critique: false },
];

const card = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '20px',
};

const AdminCorrectionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [criteres, setCriteres] = useState(CRITERES_INIT);
  const [commentaire, setCommentaire] = useState('');
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const score = criteres.reduce((acc, c) => acc + (c.coche ? c.poids : 0), 0);
  const scoreColor = score >= 70 ? '#6a9e6a' : score >= 50 ? '#c9a94e' : '#c0505a';

  const toggleCritere = (i) => {
    setCriteres(prev => prev.map((c, idx) => idx === i ? { ...c, coche: !c.coche } : c));
  };

  const handleGrade = (status) => {
    setSaving(true);
    setTimeout(() => {
      setMessage({
        type: status === 'validated' ? 'success' : 'error',
        text: status === 'validated'
          ? '✓ Livrable validé — certificat émis et email envoyé à l\'apprenant.'
          : '✗ Livrable refusé — l\'apprenant a été notifié.',
      });
      setSaving(false);
      setTimeout(() => navigate('/admin/users'), 2000);
    }, 800);
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #080d1a 0%, #0d0f2b 100%)',
      color: '#fff',
      fontFamily: 'Inter, sans-serif',
    }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => navigate('/admin/users')} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'none', border: 'none', color: '#8A93A6',
              fontSize: '13px', cursor: 'pointer',
            }}>
              <ArrowLeft size={14} /> Retour à la file
            </button>
            <span style={{ color: '#8A93A6' }}>·</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Livrable #{id}</span>
            <span style={{
              fontSize: '10px', fontWeight: '700', padding: '3px 8px',
              borderRadius: '4px', color: '#c0505a', background: 'rgba(192,80,90,0.15)',
            }}>RED TEAM</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => handleGrade('rejected')} disabled={saving} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 16px', borderRadius: '8px',
              border: '1px solid rgba(192,80,90,0.4)',
              background: 'rgba(192,80,90,0.1)', color: '#c0505a',
              fontSize: '13px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1,
            }}>
              <X size={13} /> Refuser
            </button>
            <button onClick={() => handleGrade('validated')} disabled={saving} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 16px', borderRadius: '8px',
              border: '1px solid rgba(106,158,106,0.4)',
              background: 'rgba(106,158,106,0.15)', color: '#6a9e6a',
              fontSize: '13px', fontWeight: '600', cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1,
            }}>
              <Check size={13} /> Valider & Émettre certificat
            </button>
          </div>
        </div>

        {/* Message retour */}
        {message && (
          <div style={{
            padding: '14px 18px', borderRadius: '8px', marginBottom: '20px',
            background: message.type === 'success' ? 'rgba(106,158,106,0.12)' : 'rgba(192,80,90,0.12)',
            border: `1px solid ${message.type === 'success' ? 'rgba(106,158,106,0.3)' : 'rgba(192,80,90,0.3)'}`,
            color: message.type === 'success' ? '#6a9e6a' : '#c0505a',
            fontSize: '13px', fontWeight: '600',
          }}>
            {message.text}
          </div>
        )}

        {/* Corps 2 colonnes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>

          {/* Colonne centrale */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Infos fichier */}
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#fff', margin: '0 0 6px' }}>
                    Rapport Pentest Web — Aissatou Bah
                  </h2>
                  <span style={{ fontSize: '12px', color: '#8A93A6' }}>
                    rapport-pentest-web-aissatou.pdf · 3.2 MB · soumis il y a 3j
                  </span>
                </div>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.05)', color: '#fff',
                  fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                }}>
                  <Download size={13} /> PDF
                </button>
              </div>
            </div>

            {/* Rapport terminal */}
            <div style={{
              ...card,
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.7',
            }}>
              <div style={{ textAlign: 'center', color: '#4a7fc2', fontWeight: '700', fontSize: '14px', marginBottom: '16px', letterSpacing: '0.1em' }}>
                RAPPORT DE TEST D'INTRUSION
              </div>
              <div style={{ color: '#8A93A6', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
                <div><span style={{ color: '#4a7fc2' }}>Cible :</span> demo.vulnapp.local</div>
                <div><span style={{ color: '#4a7fc2' }}>Durée :</span> 72h (black-box)</div>
                <div><span style={{ color: '#4a7fc2' }}>Auteur :</span> Aissatou Bah</div>
                <div><span style={{ color: '#4a7fc2' }}>Date :</span> 17 août 2026</div>
              </div>

              <div style={{ color: '#4a7fc2', fontWeight: '700', marginBottom: '8px' }}>## 1. RÉSUMÉ EXÉCUTIF</div>
              <div style={{ color: '#c8cdd6', marginBottom: '20px' }}>
                L'audit a révélé 3 vulnérabilités critiques permettant une compromission totale de l'application cible.
                Les failles d'injection SQL et XSS stocké constituent les risques les plus immédiats.
              </div>

              <div style={{ color: '#4a7fc2', fontWeight: '700', marginBottom: '12px' }}>## 2. VECTEURS D'ATTAQUE IDENTIFIÉS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {VULNERABILITES.map((v, i) => (
                  <div key={i} style={{
                    padding: '10px 14px', borderRadius: '6px',
                    background: v.critique ? 'rgba(192,80,90,0.08)' : 'rgba(201,169,78,0.08)',
                    border: `1px solid ${v.critique ? 'rgba(192,80,90,0.2)' : 'rgba(201,169,78,0.2)'}`,
                    display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
                  }}>
                    <span style={{ color: v.critique ? '#c0505a' : '#c9a94e', fontWeight: '700', minWidth: '130px' }}>{v.cve}</span>
                    <span style={{ color: '#8A93A6' }}>·</span>
                    <span style={{ color: '#c8cdd6' }}>{v.type}</span>
                    <span style={{ color: '#8A93A6' }}>{v.lieu}</span>
                    <span style={{ marginLeft: 'auto', color: v.critique ? '#c0505a' : '#c9a94e', fontWeight: '700' }}>CVSS {v.cvss}</span>
                  </div>
                ))}
              </div>

              <div style={{ color: '#4a7fc2', fontWeight: '700', marginBottom: '12px' }}>## 3. PROOF OF CONCEPT</div>
              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '14px' }}>
                <div style={{ color: '#6a9e6a' }}>POST /api/users HTTP/1.1</div>
                <div style={{ color: '#6a9e6a' }}>Host: demo.vulnapp.local</div>
                <div style={{ color: '#6a9e6a' }}>Content-Type: application/x-www-form-urlencoded</div>
                <div style={{ color: '#8A93A6', marginTop: '8px' }}>&nbsp;</div>
                <div style={{ color: '#c9a94e' }}>id=1' OR '1'='1'--+&pass=x</div>
              </div>
            </div>

            {/* Commentaire */}
            <div style={card}>
              <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#8A93A6', marginBottom: '10px' }}>
                COMMENTAIRE AU CANDIDAT
              </div>
              <textarea
                value={commentaire}
                onChange={e => setCommentaire(e.target.value)}
                placeholder="Votre retour détaillé pour l'apprenant…"
                rows={5}
                style={{
                  width: '100%', padding: '12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px', color: '#fff',
                  fontSize: '13px', outline: 'none',
                  resize: 'vertical', boxSizing: 'border-box',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>
          </div>

          {/* Colonne droite */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Grille */}
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', color: '#8A93A6' }}>GRILLE RED TEAM</span>
                <span style={{ fontSize: '18px', fontWeight: '800', color: scoreColor }}>{score}/100</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {criteres.map((c, i) => (
                  <div key={i} onClick={() => toggleCritere(i)} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '10px', borderRadius: '8px', cursor: 'pointer',
                    background: c.coche ? 'rgba(106,158,106,0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${c.coche ? 'rgba(106,158,106,0.2)' : 'rgba(255,255,255,0.06)'}`,
                    transition: 'all 0.15s',
                  }}>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '4px',
                      flexShrink: 0, marginTop: '1px',
                      background: c.coche ? 'rgba(106,158,106,0.3)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${c.coche ? '#6a9e6a' : 'rgba(255,255,255,0.15)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {c.coche && <Check size={11} color="#6a9e6a" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#fff', lineHeight: '1.4' }}>{c.label}</div>
                      <div style={{ fontSize: '11px', color: '#8A93A6', marginTop: '2px' }}>Poids : {c.poids}pts</div>
                    </div>
                    {c.coche && <Check size={13} color="#6a9e6a" style={{ flexShrink: 0, marginTop: '2px' }} />}
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '16px', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#8A93A6' }}>Résultat</span>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: scoreColor }}>{score}/100</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', textAlign: 'right', color: scoreColor }}>
                  {score >= 70 ? 'Validé ✓' : 'Refusé ✗'}
                </div>
              </div>
            </div>

            {/* Apprenant */}
            <div style={card}>
              <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#8A93A6', marginBottom: '14px' }}>
                APPRENANT
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  background: '#c0505a', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '15px', fontWeight: '700', color: '#fff',
                }}>A</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>Aissatou Bah</div>
                  <div style={{ fontSize: '11px', color: '#8A93A6' }}>aissatou.b@example.com</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Parcours', value: 'Pentest Web' },
                  { label: 'Progression', value: '87%' },
                  { label: 'Tentatives', value: '1 / 3' },
                  { label: 'Langue', value: 'FR' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#8A93A6' }}>{row.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCorrectionDetail;