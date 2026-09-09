

// Couleur principale bleue
export const BRAND = '#3b6df0';
export const BRAND_ALPHA = 'rgba(59,109,240,0.22)';
export const BRAND_BORDER = 'rgba(59,109,240,0.4)';
export const BRAND_BG = 'rgba(59,109,240,0.15)';

// Familles
export const RED_TEAM = {
  color: '#c0505a',
  bg: 'rgba(192,80,90,0.15)',
  label: 'RED TEAM',
};

export const BLUE_TEAM = {
  color: '#4a7fc2',
  bg: 'rgba(74,127,194,0.15)',
  label: 'BLUE TEAM',
};

export const GRC = {
  color: '#c9a94e',
  bg: 'rgba(201,169,78,0.15)',
  label: 'GRC',
};

// Statuts
export const SUCCESS = {
  color: '#6a9e6a',
  bg: 'rgba(106,158,106,0.15)',
};

export const WARNING = {
  color: '#c9a94e',
  bg: 'rgba(201,169,78,0.15)',
};

export const DANGER = {
  color: '#c0505a',
  bg: 'rgba(192,80,90,0.15)',
};

export const NEUTRAL = {
  color: '#8A93A6',
  bg: 'rgba(138,147,166,0.15)',
};

// Fond général dashboard
export const DASHBOARD_BG = 'linear-gradient(135deg, #080d1a 0%, #0d0f2b 100%)';

// Textes
export const TEXT_PRIMARY = '#ffffff';
export const TEXT_MUTED = '#8A93A6';

// Helper — retourne les couleurs d'une famille
export const familleColors = (famille) => {
  if (famille === 'RED TEAM') return RED_TEAM;
  if (famille === 'BLUE TEAM') return BLUE_TEAM;
  return GRC;
};

// Helper — retourne les couleurs d'un statut
export const statutColors = (statut) => {
  if (statut === 'Payé' || statut === 'Actif' || statut === 'validated') return SUCCESS;
  if (statut === 'En attente' || statut === 'pending') return WARNING;
  if (statut === 'Remboursé' || statut === 'Inactif') return NEUTRAL;
  return DANGER;
};
