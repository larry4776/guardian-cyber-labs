

import { BRAND, BRAND_BORDER, DASHBOARD_BG } from './colors';

// Fond général de chaque page admin
export const pageWrapper = {
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
  background: DASHBOARD_BG,
  color: '#ffffff',
  fontFamily: 'Inter, sans-serif',
};

// Zone de contenu principale (droite de la sidebar)
export const mainContent = {
  flex: 1,
  padding: '32px',
  overflowY: 'auto',
};

// Carte générique
export const card = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
};

// Carte avec padding inclus
export const cardPadded = {
  ...card,
  padding: '20px',
};

// Champ de saisie
export const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
};

// Label de formulaire
export const labelStyle = {
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.1em',
  color: '#8A93A6',
  marginBottom: '8px',
  display: 'block',
};

// En-tête de colonne tableau
export const thStyle = {
  padding: '14px 16px',
  textAlign: 'left',
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.1em',
  color: '#8A93A6',
};

// Bouton primaire bleu
export const btnPrimary = {
  background: BRAND,
  border: `1px solid ${BRAND_BORDER}`,
  color: '#fff',
  borderRadius: '8px',
  padding: '10px 18px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
};

// Bouton secondaire transparent
export const btnSecondary = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff',
  borderRadius: '8px',
  padding: '10px 18px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
};

// Bouton danger rouge
export const btnDanger = {
  background: 'rgba(192,80,90,0.1)',
  border: '1px solid rgba(192,80,90,0.4)',
  color: '#c0505a',
  borderRadius: '8px',
  padding: '9px 16px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
};

// Bouton succès vert
export const btnSuccess = {
  background: 'rgba(106,158,106,0.15)',
  border: '1px solid rgba(106,158,106,0.4)',
  color: '#6a9e6a',
  borderRadius: '8px',
  padding: '9px 16px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
};

// Badge statut générique
export const badge = {
  fontSize: '11px',
  fontWeight: '700',
  padding: '4px 10px',
  borderRadius: '6px',
};

// Badge famille
export const familleBadge = {
  fontSize: '10px',
  fontWeight: '700',
  padding: '4px 8px',
  borderRadius: '4px',
};
