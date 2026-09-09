
export const LIVRABLES = [
  { id: '2847', nom: 'Moussa Diallo', parcours: 'Pentest Web', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', type: 'Rapport PDF', soumis: '3h ago', attente: '3h', enRetard: false, statut: 'En attente' },
  { id: '2846', nom: 'Ama Owusu', parcours: 'SOC Analyst L1', famille: 'BLUE TEAM', familleColor: '#4a7fc2', familleBg: 'rgba(74,127,194,0.15)', type: 'Scénario décisionnel', soumis: '5h ago', attente: '5h', enRetard: false, statut: 'En attente' },
  { id: '2845', nom: 'Ibrahim Touré', parcours: 'ISO 27001 Lead', famille: 'GRC', familleColor: '#c9a94e', familleBg: 'rgba(201,169,78,0.15)', type: 'Fichier DOCX', soumis: '8h ago', attente: '8h', enRetard: false, statut: 'En attente' },
  { id: '2844', nom: 'Kofi Mensah', parcours: 'Ethical Hacking', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', type: 'Terminal simulé', soumis: '1j ago', attente: '26h', enRetard: false, statut: 'En cours' },
  { id: '2843', nom: 'Fatou Sow', parcours: 'Threat Hunting', famille: 'BLUE TEAM', familleColor: '#4a7fc2', familleBg: 'rgba(74,127,194,0.15)', type: 'Rapport PDF', soumis: '2j ago', attente: '52h', enRetard: true, statut: 'En attente' },
  { id: '2842', nom: 'Jean-Luc Martin', parcours: 'RGPD & Conformité', famille: 'GRC', familleColor: '#c9a94e', familleBg: 'rgba(201,169,78,0.15)', type: 'Fichier DOCX', soumis: '2j ago', attente: '49h', enRetard: true, statut: 'En attente' },
  { id: '2841', nom: 'Aissatou Bah', parcours: 'Pentest Web', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', type: 'Rapport PDF', soumis: '3j ago', attente: '74h', enRetard: true, statut: 'En attente' },
  { id: '2840', nom: 'Seun Adeyemi', parcours: 'Active Directory', famille: 'RED TEAM', familleColor: '#c0505a', familleBg: 'rgba(192,80,90,0.15)', type: 'Terminal simulé', soumis: '1h ago', attente: '1h', enRetard: false, statut: 'En attente' },
];

export const CRITERES_CORRECTION = [
  { label: "Identification correcte des vecteurs d'injection", poids: 20, coche: false },
  { label: "Payload de bypass WAF documenté", poids: 15, coche: false },
  { label: "Proof of concept fonctionnel inclus", poids: 20, coche: true },
  { label: "Recommandations de remédiation pertinentes", poids: 20, coche: false },
  { label: "Rapport structuré (exec summary + technique)", poids: 15, coche: true },
  { label: "Screenshots et logs annotés", poids: 5, coche: false },
  { label: "CVSS calculé correctement", poids: 5, coche: false },
];

export const VULNERABILITES = [
  { cve: 'CVE-2024-3891', type: 'SQLi', lieu: 'POST /api/users', cvss: 9.8, critique: true },
  { cve: 'CVE-2024-2201', type: 'XSS Stored', lieu: '/comments', cvss: 8.2, critique: true },
  { cve: 'CVE-2024-1501', type: 'IDOR', lieu: '/api/docs/:id', cvss: 7.5, critique: false },
];
