import React, { useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';

const PALETTE = {
  red: { main: '#a94442', text: '#c0505a', bg: 'rgba(169,68,66,0.08)', border: 'rgba(169,68,66,0.35)' },
  blue: { main: '#3b6ea5', text: '#4a7fc2', bg: 'rgba(59,110,165,0.08)', border: 'rgba(59,110,165,0.35)' },
  gold: { main: '#b8974a', text: '#c9a94e', bg: 'rgba(184,151,74,0.08)', border: 'rgba(184,151,74,0.35)' },
};

const BADGE_TYPES = {
  terminal: { label: 'Terminal simulé', color: '#4a7fc2', border: 'rgba(59,110,165,0.4)', bg: 'rgba(59,110,165,0.08)' },
  document: { label: 'Document', color: '#8A93A6', border: 'rgba(138,147,166,0.4)', bg: 'rgba(138,147,166,0.08)' },
  scenario: { label: 'Scénario décisionnel', color: '#c9a94e', border: 'rgba(184,151,74,0.4)', bg: 'rgba(184,151,74,0.08)' },
};

const COURSE_IMAGES = {
  red_team: [
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
    'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=1200&q=80',
    'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1200&q=80',
  ],
  blue_team: [
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&q=80',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80',
  ],
  grc: [
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
    'https://images.unsplash.com/photo-1553484771-371a605b060b?w=1200&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
  ],
};

const COURSES = [
  {
    id: 1, title: 'Introduction au Pentesting', price: '$49', level: 'beginner', level_fr: 'Débutant',
    duration: '18h', category: 'red_team', label: 'Red Team', palette: PALETTE.red,
    instructor: 'Marcus V.',
    description_fr: "À la fin de ce parcours, vous serez capable de réaliser un audit de sécurité réseau complet sur un lab contrôlé. Vous maîtriserez les outils fondamentaux du pentesting (Nmap, Metasploit, Kali Linux) et saurez identifier, exploiter et documenter des vulnérabilités réelles.",
    description_en: "By the end of this course, you will be able to perform a complete network security audit on a controlled lab. You will master fundamental pentesting tools (Nmap, Metasploit, Kali Linux) and know how to identify, exploit and document real vulnerabilities.",
    tags: ['Nmap', 'Metasploit', 'Kali Linux', 'TCP/IP', 'Énumération', 'CVE'],
    prerequisites: 'Aucun prérequis obligatoire',
    lessons: [
      { num: '01', title: 'Mise en place de votre lab Kali Linux', type: 'terminal' },
      { num: '02', title: 'Concepts fondamentaux TCP/IP & protocoles', type: 'document' },
      { num: '03', title: 'Découverte et cartographie réseau avec Nmap', type: 'terminal' },
      { num: '04', title: 'Énumération des services et versions', type: 'terminal' },
      { num: '05', title: 'Identification des vulnérabilités (CVE, NVD)', type: 'document' },
      { num: '06', title: 'Introduction à Metasploit Framework', type: 'terminal' },
      { num: '07', title: 'Premier exploit guidé : EternalBlue (lab)', type: 'scenario' },
      { num: '08', title: "Post-exploitation basique : collecte d'info", type: 'terminal' },
      { num: '09', title: "Rédaction d'un rapport de pentest", type: 'document' },
      { num: '10', title: 'Scénario final : audit complet réseau lab', type: 'scenario' },
    ],
  },
  {
    id: 2, title: 'OWASP Top 10 — Web Offensif', price: '$79', level: 'intermediate', level_fr: 'Intermédiaire',
    duration: '24h', category: 'red_team', label: 'Red Team', palette: PALETTE.red,
    instructor: 'Marcus V.',
    description_fr: "Maîtrisez les 10 vulnérabilités web les plus critiques selon l'OWASP. Vous apprendrez à détecter et exploiter les injections SQL, XSS, CSRF et autres failles avec Burp Suite dans un environnement légal et sécurisé.",
    description_en: "Master the 10 most critical web vulnerabilities according to OWASP. You will learn to detect and exploit SQL injections, XSS, CSRF and other flaws with Burp Suite in a legal and secure environment.",
    tags: ['Burp Suite', 'SQLi', 'XSS', 'CSRF', 'OWASP', 'Web Security'],
    prerequisites: 'Bases en informatique recommandées',
    lessons: [
      { num: '01', title: "Introduction à OWASP et environnement de lab", type: 'document' },
      { num: '02', title: 'Injection SQL : détection et exploitation', type: 'terminal' },
      { num: '03', title: 'Cross-Site Scripting (XSS) réfléchi et stocké', type: 'terminal' },
      { num: '04', title: 'CSRF : vol de session et bypass', type: 'scenario' },
      { num: '05', title: 'Broken Authentication & Session Management', type: 'document' },
      { num: '06', title: 'Prise en main de Burp Suite Pro', type: 'terminal' },
      { num: '07', title: "IDOR et contrôle d'accès cassé", type: 'terminal' },
      { num: '08', title: 'Sécurité des APIs REST et GraphQL', type: 'document' },
      { num: '09', title: "Scénario : audit d'une app web complète", type: 'scenario' },
      { num: '10', title: 'Rédaction du rapport de vulnérabilités web', type: 'document' },
    ],
  },
  {
    id: 3, title: 'Active Directory Attacks', price: '$99', level: 'advanced', level_fr: 'Avancé',
    duration: '32h', category: 'red_team', label: 'Red Team', palette: PALETTE.red,
    instructor: 'Marcus V.',
    description_fr: "Maîtrisez les attaques avancées sur Active Directory. Vous apprendrez à cartographier un domaine AD, exploiter les relations de confiance et réaliser des attaques Pass-the-Hash, Kerberoasting et Golden Ticket.",
    description_en: "Master advanced Active Directory attacks. You will learn to map an AD domain, exploit trust relationships and perform Pass-the-Hash, Kerberoasting and Golden Ticket attacks.",
    tags: ['BloodHound', 'Pass-the-Hash', 'Kerberoast', 'Active Directory', 'Mimikatz', 'Golden Ticket'],
    prerequisites: 'Expérience en pentesting recommandée',
    lessons: [
      { num: '01', title: 'Architecture Active Directory : concepts clés', type: 'document' },
      { num: '02', title: 'Reconnaissance et cartographie avec BloodHound', type: 'terminal' },
      { num: '03', title: 'Attaques sur les credentials : Pass-the-Hash', type: 'terminal' },
      { num: '04', title: 'Kerberoasting et AS-REP Roasting', type: 'terminal' },
      { num: '05', title: 'Exploitation des GPO et délégations', type: 'scenario' },
      { num: '06', title: 'Lateral movement et pivot réseau', type: 'terminal' },
      { num: '07', title: 'Golden Ticket et Silver Ticket', type: 'terminal' },
      { num: '08', title: 'DCSync et extraction de la base NTDS', type: 'terminal' },
      { num: '09', title: "Scénario : compromission complète d'un domaine", type: 'scenario' },
      { num: '10', title: "Rapport d'audit Active Directory", type: 'document' },
    ],
  },
  {
    id: 4, title: 'OSINT & Reconnaissance', price: '$39', level: 'intermediate', level_fr: 'Intermédiaire',
    duration: '12h', category: 'red_team', label: 'Red Team', palette: PALETTE.red,
    instructor: 'Marcus V.',
    description_fr: "Apprenez à collecter des informations sur une cible à partir de sources ouvertes. Maîtrisez Maltego, Shodan et les techniques OSINT pour la phase de reconnaissance lors d'un pentest.",
    description_en: "Learn to collect information about a target from open sources. Master Maltego, Shodan and OSINT techniques for the reconnaissance phase during a pentest.",
    tags: ['Maltego', 'Shodan', 'OSINT', 'Reconnaissance', 'Google Dorks'],
    prerequisites: 'Bases en informatique',
    lessons: [
      { num: '01', title: "Introduction à l'OSINT et cadre légal", type: 'document' },
      { num: '02', title: 'Google Dorks et recherche avancée', type: 'terminal' },
      { num: '03', title: 'Prise en main de Maltego', type: 'terminal' },
      { num: '04', title: 'Shodan : moteur de recherche des objets connectés', type: 'terminal' },
      { num: '05', title: 'OSINT sur les réseaux sociaux', type: 'document' },
      { num: '06', title: 'Reconnaissance DNS et infrastructure', type: 'terminal' },
      { num: '07', title: "Scénario : profil complet d'une cible fictive", type: 'scenario' },
      { num: '08', title: 'Rapport de reconnaissance', type: 'document' },
    ],
  },
  {
    id: 5, title: 'Fondamentaux du SOC', price: '$49', level: 'beginner', level_fr: 'Débutant',
    duration: '26h', category: 'blue_team', label: 'Blue Team', palette: PALETTE.blue,
    instructor: 'Aisha K.',
    description_fr: "Découvrez le rôle d'analyste SOC et maîtrisez les outils fondamentaux de supervision de la sécurité. Vous apprendrez à lire des alertes, utiliser un SIEM et répondre aux incidents de base.",
    description_en: "Discover the SOC analyst role and master fundamental security monitoring tools. You will learn to read alerts, use a SIEM and respond to basic incidents.",
    tags: ['SIEM', 'Splunk', 'Log Analysis', 'SOC', 'Alertes', 'Incident'],
    prerequisites: 'Aucun prérequis obligatoire',
    lessons: [
      { num: '01', title: "Le métier d'analyste SOC : rôles et responsabilités", type: 'document' },
      { num: '02', title: 'Introduction aux SIEM et à Splunk', type: 'terminal' },
      { num: '03', title: 'Lecture et interprétation des logs système', type: 'terminal' },
      { num: '04', title: 'Gestion des alertes : tri et priorisation', type: 'document' },
      { num: '05', title: "Détection d'intrusion basique", type: 'terminal' },
      { num: '06', title: 'Scénario : première alerte réelle', type: 'scenario' },
      { num: '07', title: "Escalade et communication d'incident", type: 'document' },
      { num: '08', title: 'Rapport d\'incident niveau 1', type: 'document' },
    ],
  },
  {
    id: 6, title: 'Analyse de Malware', price: '$79', level: 'intermediate', level_fr: 'Intermédiaire',
    duration: '28h', category: 'blue_team', label: 'Blue Team', palette: PALETTE.blue,
    instructor: 'Aisha K.',
    description_fr: "Apprenez à analyser des logiciels malveillants en environnement isolé. Vous utiliserez Wireshark, des sandboxes et des techniques de reverse engineering pour comprendre le comportement des malwares.",
    description_en: "Learn to analyze malware in an isolated environment. You will use Wireshark, sandboxes and reverse engineering techniques to understand malware behavior.",
    tags: ['Wireshark', 'Sandbox', 'RE', 'Malware', 'IDA Pro', 'Behavioral Analysis'],
    prerequisites: 'Bases en réseau et système recommandées',
    lessons: [
      { num: '01', title: "Types de malwares et vecteurs d'infection", type: 'document' },
      { num: '02', title: "Mise en place d'un lab d'analyse sécurisé", type: 'terminal' },
      { num: '03', title: 'Analyse statique : strings, imports, entropie', type: 'terminal' },
      { num: '04', title: 'Analyse dynamique avec sandbox', type: 'terminal' },
      { num: '05', title: 'Capture réseau avec Wireshark', type: 'terminal' },
      { num: '06', title: 'Introduction au reverse engineering', type: 'document' },
      { num: '07', title: "Scénario : analyse d'un ransomware réel (lab)", type: 'scenario' },
      { num: '08', title: 'Rapport d\'analyse malware', type: 'document' },
    ],
  },
  {
    id: 7, title: 'Threat Hunting avancé', price: '$99', level: 'advanced', level_fr: 'Avancé',
    duration: '36h', category: 'blue_team', label: 'Blue Team', palette: PALETTE.blue,
    instructor: 'Aisha K.',
    description_fr: "Maîtrisez les techniques de chasse aux menaces avec YARA, MITRE ATT&CK et la Threat Intelligence. Vous apprendrez à détecter des attaquants furtifs avant qu'ils ne causent des dommages.",
    description_en: "Master threat hunting techniques with YARA, MITRE ATT&CK and Threat Intelligence. You will learn to detect stealthy attackers before they cause damage.",
    tags: ['Threat Intel', 'YARA', 'MITRE ATT&CK', 'Hunting', 'IOC', 'TTPs'],
    prerequisites: 'Expérience SOC recommandée',
    lessons: [
      { num: '01', title: 'Introduction au Threat Hunting et philosophie', type: 'document' },
      { num: '02', title: 'MITRE ATT&CK : framework et utilisation', type: 'document' },
      { num: '03', title: 'Création et utilisation de règles YARA', type: 'terminal' },
      { num: '04', title: 'Threat Intelligence : sources et IOC', type: 'document' },
      { num: '05', title: 'Chasse aux menaces avec Splunk', type: 'terminal' },
      { num: '06', title: 'Détection des Living off the Land (LOLBins)', type: 'terminal' },
      { num: '07', title: 'Scénario : APT simulée — détection et réponse', type: 'scenario' },
      { num: '08', title: 'Rapport de Threat Hunting', type: 'document' },
    ],
  },
  {
    id: 8, title: 'Lecture et analyse de logs', price: '$29', level: 'beginner', level_fr: 'Débutant',
    duration: '10h', category: 'blue_team', label: 'Blue Team', palette: PALETTE.blue,
    instructor: 'Aisha K.',
    description_fr: "Apprenez à lire et analyser les logs système, réseau et application. Vous maîtriserez Syslog, les événements Windows et la stack ELK pour détecter des anomalies.",
    description_en: "Learn to read and analyze system, network and application logs. You will master Syslog, Windows Events and the ELK stack to detect anomalies.",
    tags: ['Syslog', 'Windows Events', 'ELK', 'Log Analysis', 'Elasticsearch'],
    prerequisites: 'Aucun prérequis obligatoire',
    lessons: [
      { num: '01', title: 'Types de logs et leur rôle en sécurité', type: 'document' },
      { num: '02', title: 'Syslog : format et analyse', type: 'terminal' },
      { num: '03', title: 'Événements Windows : IDs critiques', type: 'document' },
      { num: '04', title: 'Introduction à la stack ELK', type: 'terminal' },
      { num: '05', title: "Corrélation de logs et détection d'anomalies", type: 'terminal' },
      { num: '06', title: "Scénario : détecter une intrusion dans les logs", type: 'scenario' },
    ],
  },
  {
    id: 9, title: 'Introduction ISO 27001', price: '$49', level: 'beginner', level_fr: 'Débutant',
    duration: '15h', category: 'grc', label: 'GRC', palette: PALETTE.gold,
    instructor: 'Sophie M.',
    description_fr: "Découvrez la norme ISO 27001 et apprenez à mettre en place un Système de Management de la Sécurité de l'Information (SMSI). Vous comprendrez les exigences de la norme et saurez préparer une organisation à la certification.",
    description_en: "Discover the ISO 27001 standard and learn to implement an Information Security Management System (ISMS). You will understand the standard requirements and know how to prepare an organization for certification.",
    tags: ['ISO 27001', 'SMSI', 'Politique', 'Audit', 'Certification'],
    prerequisites: 'Aucun prérequis obligatoire',
    lessons: [
      { num: '01', title: 'Introduction à la famille ISO 27000', type: 'document' },
      { num: '02', title: "Structure et exigences de l'ISO 27001", type: 'document' },
      { num: '03', title: 'Périmètre et contexte du SMSI', type: 'document' },
      { num: '04', title: 'Analyse des risques : méthode et outils', type: 'terminal' },
      { num: '05', title: "Déclaration d'applicabilité (SoA)", type: 'document' },
      { num: '06', title: 'Politiques et procédures de sécurité', type: 'document' },
      { num: '07', title: 'Scénario : préparer un audit de certification', type: 'scenario' },
      { num: '08', title: "Rapport d'évaluation de conformité", type: 'document' },
    ],
  },
  {
    id: 10, title: 'RGPD : Conformité & DPO', price: '$59', level: 'intermediate', level_fr: 'Intermédiaire',
    duration: '18h', category: 'grc', label: 'GRC', palette: PALETTE.gold,
    instructor: 'Sophie M.',
    description_fr: "Maîtrisez les obligations du RGPD et le rôle du Délégué à la Protection des Données (DPO). Vous apprendrez à réaliser des analyses d'impact (PIA) et à mettre en conformité une organisation.",
    description_en: "Master GDPR obligations and the role of the Data Protection Officer (DPO). You will learn to conduct impact assessments (PIA) and bring an organization into compliance.",
    tags: ['RGPD', 'DPO', 'PIA', 'Conformité', 'Données personnelles'],
    prerequisites: 'Bases en droit ou gestion recommandées',
    lessons: [
      { num: '01', title: 'Histoire et principes fondamentaux du RGPD', type: 'document' },
      { num: '02', title: 'Rôle et missions du DPO', type: 'document' },
      { num: '03', title: 'Cartographie des traitements de données', type: 'terminal' },
      { num: '04', title: "Analyse d'impact relative à la protection des données (PIA)", type: 'document' },
      { num: '05', title: 'Droits des personnes : mise en œuvre pratique', type: 'scenario' },
      { num: '06', title: 'Transferts internationaux de données', type: 'document' },
      { num: '07', title: 'Gestion des violations de données', type: 'scenario' },
      { num: '08', title: 'Rapport de conformité RGPD', type: 'document' },
    ],
  },
  {
    id: 11, title: 'Audit de sécurité EBIOS RM', price: '$89', level: 'advanced', level_fr: 'Avancé',
    duration: '24h', category: 'grc', label: 'GRC', palette: PALETTE.gold,
    instructor: 'Sophie M.',
    description_fr: "Maîtrisez la méthode EBIOS Risk Manager pour conduire des analyses de risque cyber complexes. Vous serez capable de piloter un atelier EBIOS RM complet et de produire un plan de traitement des risques.",
    description_en: "Master the EBIOS Risk Manager method to conduct complex cyber risk analyses. You will be able to lead a complete EBIOS RM workshop and produce a risk treatment plan.",
    tags: ['EBIOS RM', 'Risque', 'Audit', 'Analyse', 'Plan de traitement'],
    prerequisites: 'Expérience en GRC recommandée',
    lessons: [
      { num: '01', title: 'Introduction à EBIOS Risk Manager', type: 'document' },
      { num: '02', title: 'Atelier 1 : cadrage et socle de sécurité', type: 'document' },
      { num: '03', title: 'Atelier 2 : sources de risque', type: 'terminal' },
      { num: '04', title: 'Atelier 3 : scénarios stratégiques', type: 'scenario' },
      { num: '05', title: 'Atelier 4 : scénarios opérationnels', type: 'scenario' },
      { num: '06', title: 'Atelier 5 : traitement du risque', type: 'document' },
      { num: '07', title: "Scénario complet : EBIOS RM d'une infrastructure critique", type: 'scenario' },
      { num: '08', title: "Rapport d'analyse des risques", type: 'document' },
    ],
  },
  {
    id: 12, title: 'Gestion de crise cyber', price: '$49', level: 'intermediate', level_fr: 'Intermédiaire',
    duration: '12h', category: 'grc', label: 'GRC', palette: PALETTE.gold,
    instructor: 'Sophie M.',
    description_fr: "Apprenez à gérer une crise cyber de bout en bout : de la détection à la communication de crise, en passant par la coordination des équipes et la continuité d'activité.",
    description_en: "Learn to manage a cyber crisis end-to-end: from detection to crisis communication, including team coordination and business continuity.",
    tags: ['PCA', 'Incident', 'Communication', 'Crise', 'PRI', 'Coordination'],
    prerequisites: 'Bases en GRC recommandées',
    lessons: [
      { num: '01', title: "Anatomie d'une crise cyber", type: 'document' },
      { num: '02', title: "Plan de Continuité d'Activité (PCA)", type: 'document' },
      { num: '03', title: 'Cellule de crise : rôles et organisation', type: 'document' },
      { num: '04', title: 'Communication de crise interne et externe', type: 'scenario' },
      { num: '05', title: 'Coordination avec les autorités (ANSSI, CNIL)', type: 'document' },
      { num: '06', title: 'Scénario : simulation de crise ransomware', type: 'scenario' },
      { num: '07', title: "Retour d'expérience et amélioration continue", type: 'document' },
    ],
  },
];

const LEVEL_PALETTE = {
  beginner: { color: '#6a9e6a', border: 'rgba(106,158,106,0.4)', bg: 'rgba(106,158,106,0.08)' },
  intermediate: { color: '#c9a94e', border: 'rgba(201,169,78,0.4)', bg: 'rgba(201,169,78,0.08)' },
  advanced: { color: '#c0505a', border: 'rgba(192,80,90,0.4)', bg: 'rgba(192,80,90,0.08)' },
};

const CourseDetails = () => {
  const { id } = useParams();
  const { language } = useContext(LanguageContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const fr = language === 'fr';

  const course = COURSES.find(c => c.id === parseInt(id));

  if (!course) {
    return (
      <div className="min-h-screen bg-base text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-muted text-sm">Formation introuvable.</p>
          <Link to="/catalog" className="font-mono text-xs text-primary hover:text-white transition-colors">← Retour au catalogue</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const levelP = LEVEL_PALETTE[course.level];
  const courseImage = COURSE_IMAGES[course.category][(course.id - 1) % 4];

  const handleEnroll = () => {
    if (!isAuthenticated) navigate('/login');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-base text-white font-sans">
      <Navbar />

      {/* IMAGE EN GRAND EN HAUT — titre superposé */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <img
          src={courseImage}
          alt={course.title}
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.45) saturate(0.7)' }}
        />
        {/* Dégradé sombre vers le bas */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, #0a0e17 0%, rgba(10,14,23,0.5) 50%, rgba(10,14,23,0.15) 100%)' }} />

        {/* Fil d'ariane + Badge + Titre superposés */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-3">
            <Link to="/catalog" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft size={12} /> {fr ? 'Catalogue' : 'Catalog'}
            </Link>
            <span>/</span>
            <span style={{ color: course.palette.text }}>{course.label}</span>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 rounded mb-3 inline-block"
            style={{ color: course.palette.text, border: `1px solid ${course.palette.border}`, background: 'rgba(0,0,0,0.5)' }}>
            {course.label}
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mt-2">
            {course.title}
          </h1>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">

          <div className="space-y-10">

            {/* Description */}
            <div>
              <p className="font-mono text-xs text-primary tracking-widest mb-4">[ DESCRIPTION ]</p>
              <p className="text-muted text-sm leading-relaxed">
                {fr ? course.description_fr : course.description_en}
              </p>
            </div>

            {/* Skill Tags */}
            <div>
              <p className="font-mono text-xs text-primary tracking-widest mb-4">[ SKILL TAGS ]</p>
              <div className="flex flex-wrap gap-2">
                {course.tags.map(tag => (
                  <span key={tag} className="font-mono text-xs px-3 py-1.5 rounded"
                    style={{ color: course.palette.text, border: `1px solid ${course.palette.border}`, background: course.palette.bg }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Plan de leçons */}
            <div>
              <p className="font-mono text-xs text-primary tracking-widest mb-4">[ PLAN DE LEÇONS ]</p>
              <div className="space-y-2">
                {course.lessons.map((lesson) => {
                  const badge = BADGE_TYPES[lesson.type];
                  return (
                    <div key={lesson.num}
                      className="flex items-center justify-between gap-4 px-5 py-4 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs shrink-0" style={{ color: course.palette.text }}>{lesson.num}</span>
                        <span className="text-sm text-slate-300">{lesson.title}</span>
                      </div>
                      <span className="font-mono text-[10px] px-2.5 py-1 rounded shrink-0 whitespace-nowrap"
                        style={{ color: badge.color, border: `1px solid ${badge.border}`, background: badge.bg }}>
                        {badge.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Sidebar sticky */}
          <div className="lg:sticky lg:top-24">
            <div className="rounded-2xl p-6 space-y-5"
              style={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <p className="font-display text-3xl font-bold text-white">{course.price} USD</p>
                <p className="font-mono text-[10px] text-muted mt-1">
                  {fr ? 'Paiement en devise locale disponible' : 'Local currency payment available'}
                </p>
              </div>

              <button onClick={handleEnroll}
                className="w-full py-3.5 rounded-lg text-sm font-semibold text-white transition-all"
                style={{ backgroundColor: '#3b6ea5', border: '1px solid rgba(59,110,165,0.4)' }}>
                {fr ? "S'inscrire à ce parcours" : 'Enroll in this course'}
              </button>

              <div className="space-y-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {[
                  { label: fr ? 'Durée estimée' : 'Estimated duration', value: course.duration, color: null },
                  { label: fr ? 'Niveau' : 'Level', value: fr ? course.level_fr : course.level.charAt(0).toUpperCase() + course.level.slice(1), color: levelP.color },
                  { label: fr ? 'Formateur référent' : 'Lead instructor', value: course.instructor, color: null },
                  { label: fr ? 'Prérequis' : 'Prerequisites', value: course.prerequisites, color: null },
                  { label: fr ? 'Famille' : 'Family', value: course.label, color: course.palette.text },
                ].map((info, i) => (
                  <div key={i} className="flex items-start justify-between gap-3">
                    <span className="font-mono text-[10px] text-muted shrink-0">{info.label}</span>
                    <span className="text-xs text-right" style={{ color: info.color || '#94A3B8' }}>{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};
export default CourseDetails;