

export const CONTENU = [
  { titre: 'Introduction au Pentest Web', parcours: 'Pentest Web', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', type: 'Leçon', typeIcon: 'book', tags: ['http-basics', 'owasp-top10'] },
  { titre: 'Injection SQL avancée', parcours: 'Pentest Web', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', type: 'Exercice', typeIcon: 'zap', tags: ['sql-injection', 'bypass'] },
  { titre: 'XSS – Reflected & Stored', parcours: 'Pentest Web', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', type: 'Quiz', typeIcon: 'quiz', tags: ['xss', 'dom-xss'] },
  { titre: "Analyse SIEM – corrélation d'événements", parcours: 'SOC Analyst L1', famille: 'BLUE TEAM', familleColor: '#4a7fc2', familleBg: 'rgba(74,127,194,0.15)', type: 'Exercice', typeIcon: 'zap', tags: ['siem', 'log-analysis'] },
  { titre: 'Gestion des risques ISO 27005', parcours: 'ISO 27001 Lead', famille: 'GRC', familleColor: '#c9a94e', familleBg: 'rgba(201,169,78,0.15)', type: 'Leçon', typeIcon: 'book', tags: ['risk-management', 'iso27005'] },
];

export const PARCOURS = [
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

export const FAMILLES_ADD = [
  { nom: 'Cloud Security', desc: 'AWS, Azure, GCP — sécurisation infrastructure cloud' },
  { nom: 'DevSecOps', desc: 'CI/CD sécurisé, shift-left, SAST/DAST' },
  { nom: 'Forensic / DFIR', desc: 'Investigation numérique et réponse à incident' },
  { nom: 'Threat Intelligence', desc: "CTI, OSINT, attribution d'acteurs" },
  { nom: 'Mobile / IoT Security', desc: 'Android, iOS, firmware hacking' },
  { nom: 'Cryptographie appliquée', desc: 'PKI, TLS, attaques cryptographiques' },
];

export const CERTIFICATS = [
  { id: 'GCL-2026-0341', titulaire: 'Aissatou Bah', parcours: 'Pentest Web', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', score: 91, date: '17 août 2026' },
  { id: 'GCL-2026-0340', titulaire: 'Fatou Sow', parcours: 'SOC Analyst L1', famille: 'BLUE TEAM', familleColor: '#4a7fc2', familleBg: 'rgba(74,127,194,0.15)', score: 78, date: '15 août 2026' },
  { id: 'GCL-2026-0339', titulaire: 'Ibrahim Touré', parcours: 'ISO 27001 Lead', famille: 'GRC', familleColor: '#c9a94e', familleBg: 'rgba(201,169,78,0.15)', score: 84, date: '14 août 2026' },
  { id: 'GCL-2026-0338', titulaire: 'Ama Owusu', parcours: 'Threat Hunting', famille: 'BLUE TEAM', familleColor: '#4a7fc2', familleBg: 'rgba(74,127,194,0.15)', score: 88, date: '12 août 2026' },
  { id: 'GCL-2026-0337', titulaire: 'Kofi Mensah', parcours: 'Ethical Hacking', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', score: 76, date: '10 août 2026' },
  { id: 'GCL-2026-0336', titulaire: 'Moussa Diallo', parcours: 'RGPD & Conformité', famille: 'GRC', familleColor: '#c9a94e', familleBg: 'rgba(201,169,78,0.15)', score: 92, date: '8 août 2026' },
];

export const DASHBOARD_STATS = [
  { label: 'INSCRITS ACTIFS', value: '429', sub: '+18 cette semaine', color: '#ffffff', subColor: '#6a9e6a' },
  { label: 'PAIEMENTS DU MOIS', value: '€ 14 280', sub: '34 transactions', color: '#6a9e6a', subColor: '#8A93A6' },
  { label: 'TAUX COMPLÉTION', value: '62 %', sub: 'moyenne globale', color: '#4a7fc2', subColor: '#8A93A6' },
  { label: 'LIVRABLES EN ATTENTE', value: '14', sub: 'dont 6 > 48h', color: '#c0505a', subColor: '#c9a94e', badge: 14 },
];

export const ACTIVITE = [
  { time: '09:41', text: 'Kofi Mensah a soumis son rapport Pentest Web', color: '#c0505a' },
  { time: '09:12', text: 'Certification émise — Ama Owusu, SOC Analyst L1', color: '#6a9e6a' },
  { time: '08:55', text: 'Nouveau paiement Stripe — Ibrahim Touré · ISO 27001', color: '#4a7fc2' },
  { time: '08:30', text: 'Livrable validé — Fatou Sow, Ethical Hacking', color: '#6a9e6a' },
  { time: '07:59', text: 'Inscription — Jean-Luc Martin, Pentest Web (FR)', color: '#c9a94e' },
];

export const PAIEMENTS_JOUR = [
  { method: 'Stripe', amount: '€ 189', status: 'Payé', statusColor: '#6a9e6a', statusBg: 'rgba(106,158,106,0.15)' },
  { method: 'MTN Mobile Money', amount: 'XOF 124 000', status: 'Payé', statusColor: '#6a9e6a', statusBg: 'rgba(106,158,106,0.15)' },
  { method: 'Wave', amount: 'XOF 89 000', status: 'Payé', statusColor: '#6a9e6a', statusBg: 'rgba(106,158,106,0.15)' },
  { method: 'PayPal', amount: '€ 320', status: 'Remboursé', statusColor: '#8A93A6', statusBg: 'rgba(138,147,166,0.15)' },
  { method: 'Stripe', amount: '€ 95', status: 'Échoué', statusColor: '#c0505a', statusBg: 'rgba(192,80,90,0.15)' },
];