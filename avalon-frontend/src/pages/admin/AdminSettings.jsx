import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from '../../components/admin/AdminTopBar';
import { CERTIFICATS } from '../../data/courses';
import { card, btnPrimary } from '../../styles/theme';

const scoreColor = (s) => s >= 90 ? '#6a9e6a' : '#c9a94e';

const AdminSettings = () => (
  <div style={{
    display: 'flex', height: '100vh', overflow: 'hidden',
    background: 'linear-gradient(135deg, #080d1a 0%, #0d0f2b 100%)',
    color: '#fff', fontFamily: 'Inter, sans-serif',
  }}>
    <AdminSidebar />

    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

      <AdminTopBar title="Certificats émis" subtitle="6 certificats émis ce mois">
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
          <Download size={14} /> Exporter tout
        </button>
        <button style={btnPrimary}>+ Émettre manuel</button>
      </AdminTopBar>

      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
        <div style={{ ...card, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['ID CERTIFICAT', 'TITULAIRE', 'PARCOURS', 'FAMILLE', 'SCORE', 'ÉMIS LE', 'VÉRIFICATION', ''].map((h, i) => (
                  <th key={i} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#8A93A6' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CERTIFICATS.map((c, i) => (
                <tr key={i} style={{ borderBottom: i < CERTIFICATS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#4a7fc2' }}>{c.id}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#fff' }}>{c.titulaire}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#fff' }}>{c.parcours}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', color: c.familleColor, background: c.familleBg }}>{c.famille}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: scoreColor(c.score) }}>{c.score}/100</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8A93A6' }}>{c.date}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <a href={`#verify/${c.id}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#4a7fc2', textDecoration: 'none' }}>
                      verify/{c.id} <ExternalLink size={11} />
                    </a>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Download size={13} color="#8A93A6" />
                      </button>
                      <button style={{ fontSize: '12px', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(192,80,90,0.3)', background: 'rgba(192,80,90,0.08)', color: '#c0505a', cursor: 'pointer' }}>Révoquer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default AdminSettings;