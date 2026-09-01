import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const Toggle = ({ on, onToggle }) => (
  <div onClick={onToggle} style={{ width: '38px', height: '22px', borderRadius: '11px', background: on ? '#3b6ea5' : 'rgba(255,255,255,0.15)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
    <div style={{ position: 'absolute', top: '3px', left: on ? '19px' : '3px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
  </div>
);

const card = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px' };
const inputStyle = { width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#8A93A6', marginBottom: '8px', display: 'block' };

const INTEGRATIONS = ['Stripe Webhook', 'SendGrid Email', 'Cloudflare CDN'];

const AdminLayout = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [toggles, setToggles] = useState({ fr: true, en: true, welcome: true, alertes: true, rappels: false });
  const flip = (key) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #080d1a 0%, #0d0f2b 100%)', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0 }}>Paramètres</h1>
          <p style={{ fontSize: '13px', color: '#8A93A6', marginTop: '4px' }}>Configuration de la plateforme</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>

          {/* Langues */}
          <div style={card}>
            <p style={{ ...labelStyle, marginBottom: '16px' }}>LANGUES DE CONTENU</p>
            {[{ key: 'fr', nom: 'Français', desc: 'Contenu disponible en FR' }, { key: 'en', nom: 'English', desc: 'Contenu disponible en EN' }].map(lang => (
              <div key={lang.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{lang.nom}</div>
                  <div style={{ fontSize: '11px', color: '#8A93A6', marginTop: '2px' }}>{lang.desc}</div>
                </div>
                <Toggle on={toggles[lang.key]} onToggle={() => flip(lang.key)} />
              </div>
            ))}
            <button style={{ marginTop: '16px', width: '100%', padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#8A93A6', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              + Ajouter une langue
            </button>
          </div>

          {/* Paramètres généraux */}
          <div style={card}>
            <p style={{ ...labelStyle, marginBottom: '16px' }}>PARAMÈTRES GÉNÉRAUX</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'NOM DE LA PLATEFORME', value: 'GUARDIAN CYBER LABS' },
                { label: 'URL DE BASE', value: 'https://guardiancyberlabs.com' },
                { label: 'EMAIL DE CONTACT', value: 'admin@guardiancyberlabs.com' },
              ].map(f => (
                <div key={f.label}>
                  <label style={labelStyle}>{f.label}</label>
                  <input defaultValue={f.value} style={inputStyle} />
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div style={card}>
            <p style={{ ...labelStyle, marginBottom: '16px' }}>NOTIFICATIONS</p>
            {[
              { key: 'welcome', nom: 'Emails de bienvenue', desc: "Envoyé à l'inscription" },
              { key: 'alertes', nom: 'Alertes nouvelles soumissions', desc: 'Notifie les correcteurs' },
              { key: 'rappels', nom: 'Rappels de complétion', desc: 'J+7 si progression < 30%' },
            ].map(n => (
              <div key={n.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{n.nom}</div>
                  <div style={{ fontSize: '11px', color: '#8A93A6', marginTop: '2px' }}>{n.desc}</div>
                </div>
                <Toggle on={toggles[n.key]} onToggle={() => flip(n.key)} />
              </div>
            ))}
          </div>

          {/* API & Intégrations */}
          <div style={card}>
            <p style={{ ...labelStyle, marginBottom: '16px' }}>API & INTÉGRATIONS</p>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>CLÉ API</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input readOnly value={showApiKey ? 'gcl_live_sk_8a3f9b2e1c7d4a6f8e2b5c9d1a3e7f4b' : '••••••••••••••••••••••••••••••••'} style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', fontSize: '12px' }} />
                <button onClick={() => setShowApiKey(!showApiKey)} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#8A93A6', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            {INTEGRATIONS.map((integ, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < INTEGRATIONS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{integ}</span>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', color: '#6a9e6a', background: 'rgba(106,158,106,0.15)' }}>Actif</span>
              </div>
            ))}
          </div>
        </div>

        {/* Boutons bas */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button style={{ padding: '11px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#8A93A6', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Annuler</button>
          <button style={{ padding: '11px 24px', background: '#3b6ea5', border: '1px solid rgba(59,110,165,0.4)', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Sauvegarder les paramètres</button>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;