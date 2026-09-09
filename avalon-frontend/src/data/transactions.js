

export const TRANSACTIONS = [
  { id: 'TXN-8821', user: 'Moussa Diallo', parcours: 'Pentest Web', methode: 'Stripe', montant: '€ 189', date: '20 août 2026', statut: 'Payé' },
  { id: 'TXN-8820', user: 'Fatou Sow', parcours: 'Threat Hunting', methode: 'Wave', montant: 'XOF 149 000', date: '20 août 2026', statut: 'Payé' },
  { id: 'TXN-8819', user: 'Kofi Mensah', parcours: 'Ethical Hacking', methode: 'MTN Mobile Money', montant: 'XOF 199 000', date: '19 août 2026', statut: 'Payé' },
  { id: 'TXN-8818', user: 'Jean-Luc Martin', parcours: 'RGPD & Conformité', methode: 'PayPal', montant: '€ 99', date: '19 août 2026', statut: 'Remboursé' },
  { id: 'TXN-8817', user: 'Ama Owusu', parcours: 'SOC Analyst L1', methode: 'Stripe', montant: '€ 149', date: '18 août 2026', statut: 'Payé' },
  { id: 'TXN-8816', user: 'Ibrahim Touré', parcours: 'ISO 27001 Lead', methode: 'Stripe', montant: '€ 295', date: '18 août 2026', statut: 'Payé' },
  { id: 'TXN-8815', user: 'Seun Adeyemi', parcours: 'AD Attacks', methode: 'PayPal', montant: '€ 219', date: '17 août 2026', statut: 'Échoué' },
];

export const STATS_PAIEMENTS = [
  { label: 'STRIPE', tx: 28, montant: '€ 9 842', color: '#4a7fc2', type: 'card' },
  { label: 'PAYPAL', tx: 12, montant: '€ 2 340', color: '#22d3ee', type: 'paypal' },
  { label: 'MTN MOBILE MONEY', tx: 18, montant: 'XOF 8.2M', color: '#c9a94e', type: 'phone' },
  { label: 'WAVE', tx: 14, montant: 'XOF 5.7M', color: '#6a9e6a', type: 'wave' },
];
