import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LanguageContext } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

const TERMINAL_LINES = [
  { text: '$ whoami', color: 'text-emerald-400' },
  { text: '> root', color: 'text-white' },
  { text: '$ nmap -sV --script vuln 192.168.1.0/24', color: 'text-emerald-400' },
  { text: '> Starting Nmap 7.94...', color: 'text-slate-400' },
  { text: '> Scanning 254 hosts...', color: 'text-slate-400' },
  { text: '> [██░░░░░░░░] 18% complete', color: 'text-slate-400' },
  { text: '> [████░░░░░░] 42% complete', color: 'text-slate-400' },
  { text: '> [████████░░] 82% complete', color: 'text-slate-400' },
  { text: '[+] Host 192.168.1.1   — port 80/tcp   OPEN', color: 'text-emerald-400' },
  { text: '[+] Host 192.168.1.42  — port 22/tcp   OPEN', color: 'text-emerald-400' },
  { text: '[+] Host 192.168.1.105 — port 443/tcp  OPEN', color: 'text-emerald-400' },
  { text: '[!] CVE-2023-38408 — OpenSSH vuln DETECTED', color: 'text-red-400' },
  { text: '[!] CVE-2021-44228 — Log4Shell DETECTED', color: 'text-red-400' },
  { text: '$ searchsploit openssh 9.3', color: 'text-emerald-400' },
  { text: '> OpenSSH < 9.6 - Remote Code Execution', color: 'text-yellow-400' },
  { text: '$ msfconsole -q', color: 'text-emerald-400' },
  { text: '> msf6 > use exploit/multi/handler', color: 'text-blue-400' },
  { text: '> msf6 exploit > set LHOST 192.168.1.200', color: 'text-slate-400' },
  { text: '> msf6 exploit > set LPORT 4444', color: 'text-slate-400' },
  { text: '> msf6 exploit > run', color: 'text-blue-400' },
  { text: '> [*] Started reverse TCP handler', color: 'text-slate-400' },
  { text: '> [*] Meterpreter session 1 opened', color: 'text-emerald-400' },
  { text: 'meterpreter > sysinfo', color: 'text-emerald-400' },
  { text: '> Computer : WIN-SRV-DC01', color: 'text-white' },
  { text: '> OS       : Windows Server 2019', color: 'text-white' },
  { text: '> User     : NT AUTHORITY\\SYSTEM', color: 'text-red-400' },
  { text: 'meterpreter > hashdump', color: 'text-emerald-400' },
  { text: '> Administrator:500:aad3b435b51404eeaad3b435b51404ee', color: 'text-yellow-400' },
  { text: '$ python3 report_gen.py --target 192.168.1.0/24', color: 'text-emerald-400' },
  { text: '> Generating pentest report...', color: 'text-slate-400' },
  { text: '> [✓] 3 critical vulnerabilities documented', color: 'text-red-400' },
  { text: '> [✓] Report saved to /output/pentest_report.pdf', color: 'text-blue-400' },
  { text: '$ hydra -l admin -P rockyou.txt ssh://192.168.1.42', color: 'text-emerald-400' },
  { text: '> [22][ssh] host: 192.168.1.42 login: admin password: letmein', color: 'text-yellow-400' },
  { text: '$ sqlmap -u "http://target.local/login" --dbs', color: 'text-emerald-400' },
  { text: '> [INFO] GET parameter "id" is vulnerable', color: 'text-red-400' },
  { text: '> available databases: [users, products, admin]', color: 'text-emerald-400' },
  { text: '$ ', color: 'text-emerald-400' },
];

const TerminalWidget = () => {
  const [lines, setLines] = useState([]);
  const [cursor, setCursor] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    const cursorInterval = setInterval(() => {
      if (!cancelled) setCursor(p => !p);
    }, 500);

    const tick = () => {
      if (cancelled) return;
      if (indexRef.current >= TERMINAL_LINES.length) {
        indexRef.current = 0;
      }
      const line = TERMINAL_LINES[indexRef.current];
      setLines(prev => [...prev.slice(-11), line]);
      indexRef.current++;
      setTimeout(tick, 700);
    };

    setTimeout(tick, 400);

    return () => {
      cancelled = true;
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div className="bg-[#080d14] border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
        <div className="w-3 h-3 rounded-full" style={{ background: '#a94442' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#c9a94e' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#6a9e6a' }} />
        <span className="ml-3 text-muted text-[11px]">guardian@cyber-labs:~$</span>
      </div>
      <div className="p-5 space-y-1.5" style={{ minHeight: '240px' }}>
        {lines.map((line, i) => (
          <div key={i} className={`${line.color} leading-relaxed`}>{line.text}</div>
        ))}
        <span className={`text-emerald-400 ${cursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>▋</span>
      </div>
    </div>
  );
};

const HexBg = () => {
  const R = 34;
  const colW = R * 1.5;
  const rowH = R * Math.sqrt(3);
  const COLS = 28;
  const ROWS = 20;

  const hexPath = (cx, cy) => {
    let d = '';
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      const x = (cx + R * Math.cos(a)).toFixed(1);
      const y = (cy + R * Math.sin(a)).toFixed(1);
      d += `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }
    return d + 'Z';
  };

  const hexes = [];
  const nodes = [];
  const seen = new Set();

  for (let row = -1; row < ROWS; row++) {
    for (let col = -1; col < COLS; col++) {
      const cx = col * colW * 2 + (row % 2 === 0 ? 0 : colW);
      const cy = row * rowH;
      hexes.push({ cx, cy, id: `${row}-${col}` });

      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const x = Math.round(cx + R * Math.cos(a));
        const y = Math.round(cy + R * Math.sin(a));
        const key = `${x},${y}`;
        if (!seen.has(key)) {
          seen.add(key);
          nodes.push({
            x, y, key,
            delay: (Math.random() * 8).toFixed(1),
            dur: (3 + Math.random() * 5).toFixed(1),
            bright: Math.random() > 0.82,
          });
        }
      }
    }
  }

  const vw = (COLS * colW * 2 + colW).toFixed(0);
  const vh = (ROWS * rowH).toFixed(0);

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%', opacity: 0.22 }}
      viewBox={`0 0 ${vw} ${vh}`}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="ng" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4a90d9" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#4a90d9" stopOpacity="0" />
        </radialGradient>
        <filter id="sf">
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <style>{`
          @keyframes np { 0%,100%{opacity:.08} 50%{opacity:.5} }
          @keyframes ng { 0%,100%{opacity:0}   50%{opacity:.18} }
        `}</style>
      </defs>

      {hexes.map(({ cx, cy, id }) => (
        <path key={id} d={hexPath(cx, cy)}
          fill="none" stroke="#1e3050" strokeWidth="0.55" opacity="0.14" />
      ))}

      {nodes.map(({ x, y, key, delay, dur, bright }) => (
        <g key={key} filter="url(#sf)">
          <circle cx={x} cy={y} r={bright ? 1.8 : 0.85}
            fill={bright ? '#8ab8ff' : '#3b6ea5'}
            style={{ animation: `np ${dur}s ${delay}s ease-in-out infinite` }} />
          {bright && (
            <circle cx={x} cy={y} r="4.5" fill="url(#ng)"
              style={{ animation: `ng ${dur}s ${delay}s ease-in-out infinite` }} />
          )}
        </g>
      ))}
    </svg>
  );
};

const PALETTE = {
  red: { main: '#a94442', text: '#c0505a', bg: 'rgba(169,68,66,0.06)', border: 'rgba(169,68,66,0.35)', tagStyle: { color: '#c0505a', border: '1px solid rgba(169,68,66,0.4)', background: 'rgba(169,68,66,0.07)' } },
  blue: { main: '#3b6ea5', text: '#4a7fc2', bg: 'rgba(59,110,165,0.06)', border: 'rgba(59,110,165,0.35)', tagStyle: { color: '#4a7fc2', border: '1px solid rgba(59,110,165,0.4)', background: 'rgba(59,110,165,0.07)' } },
  gold: { main: '#b8974a', text: '#c9a94e', bg: 'rgba(184,151,74,0.06)', border: 'rgba(184,151,74,0.35)', tagStyle: { color: '#c9a94e', border: '1px solid rgba(184,151,74,0.4)', background: 'rgba(184,151,74,0.07)' } },
};

const FAMILIES = [
  { key: 'red_team', label: 'Red Team', count_fr: '12 parcours', count_en: '12 courses', desc_fr: 'Offensive Security — Pentesting, exploitation, post-exploitation', desc_en: 'Offensive Security — Pentesting, exploitation, post-exploitation', range: 'Débutant → Avancé', tags: ['Nmap', 'Metasploit', 'OWASP', 'Kali Linux'], palette: PALETTE.red },
  { key: 'blue_team', label: 'Blue Team', count_fr: '9 parcours', count_en: '9 courses', desc_fr: 'Défense & détection — SOC, SIEM, analyse de logs, forensique', desc_en: 'Defense & detection — SOC, SIEM, log analysis, forensics', range: 'Débutant → Avancé', tags: ['Splunk', 'Wireshark', 'SIEM', 'Threat Hunt'], palette: PALETTE.blue },
  { key: 'grc', label: 'GRC', count_fr: '7 parcours', count_en: '7 courses', desc_fr: 'Gouvernance, Risque & Conformité — ISO 27001, RGPD, audit', desc_en: 'Governance, Risk & Compliance — ISO 27001, GDPR, audit', range: 'Débutant → Avancé', tags: ['ISO 27001', 'RGPD', 'Audit', 'EBIOS RM'], palette: PALETTE.gold },
];

const Home = () => {
  const { language } = useContext(LanguageContext);
  const { settings } = useSettings();
  const fr = language === 'fr';
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === '/') { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="min-h-screen text-white font-sans bg-base">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/5 min-h-[85vh] flex items-center">
        <HexBg />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 90% 90% at 50% 50%, rgba(10,14,23,0.15) 0%, rgba(10,14,23,0.9) 100%)' }} />

        <div className="relative w-full max-w-6xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-8 flex-wrap">
                <span className="font-mono text-xs font-semibold px-3 py-1.5 rounded"
                  style={{ color: PALETTE.red.text, border: `1px solid ${PALETTE.red.border}`, background: PALETTE.red.bg }}>[ RED TEAM ]</span>
                <span className="font-mono text-xs font-semibold px-3 py-1.5 rounded"
                  style={{ color: PALETTE.blue.text, border: `1px solid ${PALETTE.blue.border}`, background: PALETTE.blue.bg }}>[ BLUE TEAM ]</span>
                <span className="font-mono text-xs font-semibold px-3 py-1.5 rounded"
                  style={{ color: PALETTE.gold.text, border: `1px solid ${PALETTE.gold.border}`, background: PALETTE.gold.bg }}>[ GRC ]</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.1] mb-6 tracking-tight">
                {fr ? (<>La cybersécurité opérationnelle,<br /><span className="text-primary">sans détour.</span></>) : (<>Operational cybersecurity,<br /><span className="text-primary">straight to the point.</span></>)}
              </h1>

              <p className="text-muted text-base leading-relaxed mb-10 max-w-lg">
                {fr
                  ? 'Zéro prérequis imposé. Des compétences directement employables : Red Team, Blue Team, GRC. Des livrables réels corrigés par des humains.'
                  : 'Zero imposed prerequisites. Directly employable skills: Red Team, Blue Team, GRC. Real deliverables graded by humans.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/catalog"
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-7 py-3.5 rounded-lg transition-all text-sm">
                  {fr ? 'Voir le catalogue' : 'View catalog'} <ArrowRight size={15} />
                </Link>
                <Link to="/placement-test"
                  className="inline-flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 text-slate-200 font-semibold px-7 py-3.5 rounded-lg transition-colors text-sm">
                  {fr ? 'Test de positionnement' : 'Placement test'}
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <TerminalWidget />
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="border-b border-white/5 py-10">
        <div className="max-w-2xl mx-auto px-6">
          <p className="font-mono text-xs text-primary text-center mb-4 tracking-widest">[ SEARCH ]</p>
          <div className="relative">
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" />
            <input ref={searchRef} value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={fr ? 'Rechercher Pentest Web, SOC, ISO 27001...' : 'Search Pentest Web, SOC, ISO 27001...'}
              className="w-full bg-surface border border-white/10 rounded-xl pl-12 pr-6 py-4 text-sm text-white placeholder:text-muted outline-none focus:border-primary/50 transition-all" />
          </div>
        </div>
      </section>

      {/* TROIS FAMILLES */}
      <section className="py-20 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-mono text-xs text-primary tracking-widest mb-3">[ FORMATIONS ]</p>
            <h2 className="font-display text-3xl font-bold">
              {fr ? 'Trois familles, une plateforme' : 'Three families, one platform'}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {FAMILIES.map((f) => (
              <div key={f.key}
                className="rounded-2xl overflow-hidden transition-all duration-300 hover:translate-y-[-2px]"
                style={{ backgroundColor: `color-mix(in srgb, #0d1220 96%, ${f.palette.main} 4%)` }}>
                <div style={{ height: '5px', backgroundColor: f.palette.main }} />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-base font-bold text-white">{f.label}</span>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-full"
                      style={{ color: f.palette.text, border: `1px solid ${f.palette.border}`, background: f.palette.bg }}>
                      {fr ? f.count_fr : f.count_en}
                    </span>
                  </div>
                  <p className="text-muted text-sm leading-relaxed mb-3">{fr ? f.desc_fr : f.desc_en}</p>
                  <p className="font-mono text-xs mb-5" style={{ color: f.palette.text, opacity: 0.6 }}>{f.range}</p>
                  <div className="flex flex-wrap gap-2">
                    {f.tags.map(tag => (
                      <span key={tag} className="font-mono text-[10px] px-2.5 py-1 rounded" style={f.palette.tagStyle}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-white text-base font-semibold text-center sm:text-left leading-relaxed">
              {fr
                ? 'La seule plateforme qui couvre Red Team, Blue Team et GRC avec des livrables corrigés par des experts humains — dès le premier jour.'
                : 'The only platform covering Red Team, Blue Team and GRC with deliverables graded by human experts — from day one.'}
            </p>
            <Link to="/about"
              className="font-semibold text-sm whitespace-nowrap flex items-center gap-1 shrink-0 transition-colors"
              style={{ color: '#4a7fc2' }}>
              {fr ? 'En savoir plus' : 'Learn more'} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* COMMUNAUTÉ */}
      <section className="py-20 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-mono text-xs text-primary tracking-widest mb-3">[ COMMUNITY ]</p>
          <h2 className="font-display text-3xl font-bold mb-4">
            {fr ? 'Rejoins la communauté' : 'Join the community'}
          </h2>
          <p className="text-muted text-base max-w-xl mx-auto mb-10">
            {fr
              ? "Des milliers d'apprenants et de professionnels échangent chaque jour sur nos canaux. Pose tes questions, partage tes découvertes, construis ton réseau."
              : 'Thousands of learners and professionals exchange every day on our channels. Ask questions, share discoveries, build your network.'}
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors text-sm"
              style={{ backgroundColor: '#4a5394', border: '1px solid rgba(88,101,242,0.3)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.113 18.102.128 18.115a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
              Discord
            </a>
            <a href="https://whatsapp.com/channel/0029Va8oNXf3WHTQ8MIJzS2T" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors text-sm"
              style={{ backgroundColor: '#1a7a45', border: '1px solid rgba(37,211,102,0.3)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default Home;