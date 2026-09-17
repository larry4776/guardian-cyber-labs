import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Layers, ClipboardCheck, Users, CreditCard, Award, Settings, LayoutGrid } from 'lucide-react';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', icon: LayoutGrid, path: '/admin' },
  { label: 'Contenu', icon: BookOpen, path: '/admin/courses' },
  { label: 'Parcours & Familles', icon: Layers, path: '/admin/submissions' },
  { label: 'File de correction', icon: ClipboardCheck, path: '/admin/users', badge: 14 },
  { label: 'Utilisateurs', icon: Users, path: '/admin/payments' },
  { label: 'Paiements', icon: CreditCard, path: '/admin/messages' },
  { label: 'Certificats', icon: Award, path: '/admin/settings' },
  { label: 'Paramètres', icon: Settings, path: '/admin/layout' },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin' || location.pathname === '/admin/';
    return location.pathname === path;
  };

  return (
    <div style={{
      width: '240px',
      minWidth: '240px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      background: 'rgba(255,255,255,0.03)',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      flexShrink: 0,
    }}>

      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
            <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" stroke="#3b6df0" strokeWidth="1.5" fill="rgba(59,109,240,0.08)" />
            <polygon points="16,8 24,12 24,20 16,24 8,20 8,12" stroke="#3b6df0" strokeWidth="1" fill="none" />
            <circle cx="16" cy="16" r="2.5" fill="#3b6df0" />
          </svg>
          <span style={{
            fontSize: '12px',
            fontWeight: '800',
            letterSpacing: '0.08em',
            color: '#fff',
            whiteSpace: 'nowrap',
          }}>
            GUARDIAN <span style={{ color: '#3b6df0' }}>CYBER LABS</span>
          </span>
        </div>

        {/* Badge ADMIN + Changer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '6px 10px',
        }}>
          <span style={{ fontSize: '11px', color: '#8A93A6', fontWeight: '600', letterSpacing: '0.05em' }}>ADMIN</span>
          <button
            onClick={() => window.open('/#/dashboard', '_blank')}
            style={{ fontSize: '10px', color: '#4a7fc2', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
            Changer
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {SIDEBAR_ITEMS.map(({ label, icon: Icon, path, badge }) => {
          const active = isActive(path);
          return (
            <button key={path} onClick={() => navigate(path)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '8px', border: 'none',
                background: active ? 'rgba(59,109,240,0.2)' : 'transparent',
                color: active ? '#fff' : '#8A93A6',
                cursor: 'pointer', textAlign: 'left', width: '100%',
                fontSize: '13px', fontWeight: active ? '600' : '400',
                borderLeft: active ? '2px solid #3b6df0' : '2px solid transparent',
              }}>
              <Icon size={16} />
              <span style={{ flex: 1 }}>{label}</span>
              {badge && (
                <span style={{
                  background: '#c0505a', color: '#fff', borderRadius: '50%',
                  width: '18px', height: '18px', fontSize: '10px', fontWeight: '700',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Avatar */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%', background: '#3b6df0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', fontWeight: '700', color: '#fff', flexShrink: 0,
        }}>A</div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>Admin</div>
          <div style={{ fontSize: '11px', color: '#8A93A6' }}>Super-admin</div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
