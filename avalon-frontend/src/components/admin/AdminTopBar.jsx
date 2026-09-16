import React from 'react';

const AdminTopBar = ({ title, subtitle, children }) => {
  return (
    <div style={{
      height: '72px',
      minHeight: '72px',
      padding: '0 32px',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(8,13,26,0.95)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '12px', color: '#8A93A6', margin: 0, marginTop: '2px' }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {children}
      </div>
    </div>
  );
};

export default AdminTopBar;
