import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, BookOpen, Award, User, Edit2, ShieldCheck, Trophy, Hourglass } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { API_URL } from '../config';

const BRAND = '#2563EB';
const RED = '#EF4444';
const RED_SOFT = '#F87171';
const GREEN = '#22C55E';
const AMBER = '#F59E0B';
const GRAY = '#8B93A7';
const BG = '#0B0F19';
const CARD_BG = '#141A2A';
const CARD_BORDER = '#232B3D';

const familleColor = (title) => {
  const t = (title || '').toLowerCase();
  if (t.includes('pentest') || t.includes('hacking') || t.includes('active directory') || t.includes('ethical'))
    return { label: 'RED TEAM', color: RED };
  if (t.includes('soc') || t.includes('siem') || t.includes('threat') || t.includes('forensi') || t.includes('blue'))
    return { label: 'BLUE TEAM', color: '#4a7fc2' };
  return { label: 'GRC', color: '#c9a94e' };
};

/* ===== HEADER ===== */
const Header = () => (
  <div style={{
    height: '60px', minHeight: '60px',
    borderBottom: `1px solid ${CARD_BORDER}`,
    display: 'flex', alignItems: 'center', padding: '0 28px',
    background: BG,
    flexShrink: 0,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Shield size={20} color={BRAND} />
      <span style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '0.05em', color: '#fff', whiteSpace: 'nowrap' }}>
        GUARDIAN <span style={{ color: BRAND }}>CYBER LABS</span>
      </span>
    </div>
  </div>
);

/* ===== SIDEBAR ===== */
const Sidebar = ({ activeTab, setActiveTab, user }) => {
  const NAV = [
    { id: 'espace', label: 'Mon espace', icon: Shield },
    { id: 'parcours', label: 'Mes parcours', icon: BookOpen },
    { id: 'certificats', label: 'Mes certificats', icon: Award },
    { id: 'profil', label: 'Profil', icon: User },
  ];

  const displayName = user?.first_name || 'Kofi Mensah';
  const track = user?.track || 'Red Team Track';

  return (
    <div style={{
      width: '220px', minWidth: '220px',
      borderRight: `1px solid ${CARD_BORDER}`,
      display: 'flex', flexDirection: 'column',
      background: BG,
      flexShrink: 0,
      overflowY: 'auto',
    }}>
      <nav style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px', border: 'none',
              background: active ? 'rgba(37,99,235,0.25)' : 'transparent',
              color: active ? '#DCE6FF' : GRAY,
              cursor: 'pointer', textAlign: 'left', width: '100%',
              fontSize: '13px', fontWeight: active ? '600' : '400',
            }}>
              <Icon size={15} style={{ flexShrink: 0 }} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Avatar en bas, style capture */}
      <div style={{ padding: '16px', borderTop: `1px solid ${CARD_BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #FB923C, #F472B6)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '14px', fontWeight: '700',
            color: '#fff', flexShrink: 0,
          }}>
            {displayName[0].toUpperCase()}
          </div>
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {displayName}
            </div>
            <div style={{ fontSize: '11px', color: GRAY, marginTop: '2px' }}>{track}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===== MON ESPACE ===== */
const MonEspace = ({ enrollments, loadingEnrollments, user }) => {
  const firstName = user?.first_name || 'Kofi';

  const STATS = [
    { label: 'SKILLS VALIDÉS', value: '16', sub: 'sur 42 au total' },
    { label: 'PARCOURS ACTIFS', value: '2', sub: 'Pentest Web · Ethical Hacking' },
    { label: 'CERTIFICATS OBTENUS', value: '0', sub: '1 en cours de validation' },
  ];

  const JOURNAL = [
    { done: true, tag: 'sql-injection', tagColor: RED_SOFT, when: "Aujourd'hui 09:41", text: 'Injection SQL avancée' },
    { done: true, tag: 'owasp-top10', tagColor: RED_SOFT, when: "Aujourd'hui 08:12", text: 'Introduction Pentest Web' },
    { done: true, tag: 'http-basics', tagColor: RED_SOFT, when: 'Hier 16:55', text: 'Protocole HTTP — fondamentaux' },
    { done: true, tag: 'recon-passive', tagColor: '#A78BFA', when: 'Hier 14:30', text: 'Reconnaissance passive' },
    { done: false, tag: 'xss', tagColor: RED_SOFT, when: '19 août 11:20', text: 'XSS — Reflected & Stored' },
    { done: true, tag: 'dns-enum', tagColor: '#A78BFA', when: '18 août 15:00', text: 'Énumération DNS' },
  ];

  const BADGES = [
    { name: 'SQL Slayer', tag: 'sql-injection', date: '20 août' },
    { name: 'OWASP Pioneer', tag: 'owasp-top10', date: '20 août' },
    { name: 'HTTP Master', tag: 'http-basics', date: '19 août' },
    { name: 'Ghost Recon', tag: 'recon-passive', date: '19 août' },
    { name: 'DNS Ranger', tag: 'dns-enum', date: '18 août' },
  ];

  const PARCOURS = [
    { titre: 'Pentest Web', tag: 'RED TEAM', percent: 67, done: 12, total: 18 },
    { titre: 'Ethical Hacking', tag: 'RED TEAM', percent: 20, done: 4, total: 20 },
  ];

  return (
    <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden', padding: '28px 32px', boxSizing: 'border-box' }}>

      <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 6px' }}>
        Bon retour, {firstName}.
      </h1>
      <p style={{ fontSize: '13px', color: GRAY, margin: '0 0 24px' }}>
        Continue sur ta lancée — tu as validé <span style={{ color: RED, fontWeight: '700' }}>4 skills</span> cette semaine.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '16px', marginBottom: '24px',
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            background: CARD_BG,
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: '14px', padding: '20px',
            minWidth: 0, boxSizing: 'border-box',
          }}>
            <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', color: GRAY, marginBottom: '10px' }}>{s.label}</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#F8FAFC' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: GRAY, marginTop: '4px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px', marginBottom: '16px',
      }}>

        <div style={{
          background: CARD_BG,
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: '14px', padding: '20px',
          minWidth: 0, boxSizing: 'border-box', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', color: GRAY, marginBottom: '14px', fontFamily: 'monospace' }}>
            <span>&gt;_</span> JOURNAL DE PROGRESSION
          </div>
          <div style={{
            background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '14px',
            fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: '12px',
          }}>
            <div style={{ color: '#67E8F9', marginBottom: '12px', wordBreak: 'break-word' }}>
              guardian@kofi-mensah:~/pentest-web$ skill-log --format=timeline
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {JOURNAL.map((j, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ color: j.done ? GREEN : GRAY }}>{j.done ? '✓' : '○'}</span>
                    <span style={{
                      color: j.tagColor, border: `1px solid ${j.tagColor}66`,
                      borderRadius: '6px', padding: '2px 8px', fontSize: '11px',
                    }}>[{j.tag}]</span>
                    <span style={{ color: GRAY, fontSize: '11px', marginLeft: 'auto' }}>{j.when}</span>
                  </div>
                  <div style={{ color: '#E2E8F0', fontSize: '12px', marginTop: '4px', paddingLeft: '22px' }}>{j.text}</div>
                </div>
              ))}
              <div style={{ color: GRAY, fontSize: '12px', marginTop: '4px' }}>
                → Prochain : <span style={{ color: RED_SOFT, border: `1px solid ${RED_SOFT}66`, borderRadius: '6px', padding: '2px 8px' }}>[xss-stored]</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: CARD_BG,
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: '14px', padding: '20px',
          minWidth: 0, boxSizing: 'border-box', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', color: GRAY, marginBottom: '14px' }}>
            BADGES DE COMPÉTENCE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {BADGES.map((b, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'rgba(255,255,255,0.03)', border: `1px solid ${CARD_BORDER}`,
                borderRadius: '10px', padding: '10px 12px',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'rgba(148,163,184,0.15)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <ShieldCheck size={16} color="#94A3B8" />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{b.name}</div>
                  <span style={{
                    color: RED_SOFT, border: `1px solid ${RED_SOFT}66`,
                    borderRadius: '6px', padding: '1px 8px', fontSize: '10px',
                    fontFamily: 'monospace', display: 'inline-block', marginTop: '4px',
                  }}>[{b.tag}]</span>
                </div>
                <span style={{ fontSize: '11px', color: GRAY, flexShrink: 0 }}>{b.date}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', color: GRAY, marginBottom: '10px' }}>
              CERTIFICATION EN COURS
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Trophy size={16} color="#FCD34D" />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>Pentest Web</div>
                <div style={{ fontSize: '11px', color: GRAY }}>Livrable soumis · En attente de correction</div>
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(245,158,11,0.1)', border: `1px solid ${AMBER}55`,
              borderRadius: '10px', padding: '10px 12px',
            }}>
              <Hourglass size={14} color={AMBER} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: AMBER }}>Correction sous 48h — soumis il y a 3j</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: '14px', padding: '20px',
        minWidth: 0, boxSizing: 'border-box',
      }}>
        <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', color: GRAY, marginBottom: '16px' }}>
          PARCOURS EN COURS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {PARCOURS.map((p, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${CARD_BORDER}`,
              borderRadius: '12px', padding: '18px', minWidth: 0, boxSizing: 'border-box',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '8px' }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{p.titre}</div>
                <span style={{
                  fontSize: '10px', fontWeight: '700', color: RED,
                  border: `1px solid ${RED}66`, borderRadius: '6px', padding: '3px 8px', flexShrink: 0,
                }}>{p.tag}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '5px' }}>
                  <div style={{ width: `${p.percent}%`, height: '100%', background: RED, borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '12px', color: GRAY, flexShrink: 0 }}>{p.percent}%</span>
              </div>
              <div style={{ fontSize: '12px', color: GRAY, marginBottom: '12px' }}>{p.done} / {p.total} leçons complétées</div>
              <button style={{
                background: BRAND, color: '#fff', border: 'none', borderRadius: '8px',
                padding: '9px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                Continuer <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ===== MES PARCOURS ===== */
const MesParcours = ({ enrollments, loadingEnrollments }) => (
  <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden', padding: '28px 32px', boxSizing: 'border-box' }}>
    <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: '0 0 4px' }}>Mes parcours</h1>
    <p style={{ fontSize: '13px', color: GRAY, marginBottom: '28px' }}>Toutes vos formations en cours</p>
    {loadingEnrollments ? (
      <p style={{ color: GRAY, fontSize: '13px' }}>Chargement...</p>
    ) : enrollments.length > 0 ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {enrollments.map(e => {
          const percent = e.total_lessons > 0 ? Math.round((e.completed_lessons / e.total_lessons) * 100) : 0;
          const fam = familleColor(e.course_title);
          return (
            <div key={e.course_id} style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: '16px', padding: '24px', minWidth: 0, boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', color: fam.color, border: `1px solid ${fam.color}66` }}>
                    {fam.label}
                  </span>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#fff', margin: '10px 0 0' }}>{e.course_title}</h3>
                </div>
                <Link to={`/player/${e.course_id}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: BRAND, color: '#fff', fontWeight: '600', fontSize: '13px', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Continuer <ArrowRight size={14} />
                </Link>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '6px' }}>
                <div style={{ width: `${percent}%`, height: '100%', background: fam.color, borderRadius: '4px' }} />
              </div>
              <p style={{ fontSize: '12px', color: GRAY, marginTop: '8px' }}>
                {e.completed_lessons} / {e.total_lessons} leçons — {percent}% complété
              </p>
            </div>
          );
        })}
      </div>
    ) : (
      <div style={{ border: `1px dashed ${CARD_BORDER}`, borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
        <p style={{ color: GRAY, fontSize: '14px', marginBottom: '12px' }}>Aucune formation commencée.</p>
        <Link to="/catalog" style={{ color: BRAND, fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
          Découvrir le catalogue →
        </Link>
      </div>
    )}
  </div>
);

/* ===== MES CERTIFICATS ===== */
const MesCertificats = () => (
  <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden', padding: '28px 32px', boxSizing: 'border-box' }}>
    <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: '0 0 4px' }}>Mes certificats</h1>
    <p style={{ fontSize: '13px', color: GRAY, marginBottom: '28px' }}>Certifications obtenues</p>
    <div style={{ border: `1px dashed ${CARD_BORDER}`, borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
      <Award size={40} style={{ color: GRAY, marginBottom: '12px' }} />
      <p style={{ color: GRAY, fontSize: '14px' }}>Aucun certificat obtenu pour le moment.</p>
    </div>
  </div>
);

/* ===== PROFIL ===== */
const Profil = ({ user, enrollments, token }) => {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
  });

  const totalCours = enrollments.length;
  const coursTermines = enrollments.filter(e => e.total_lessons > 0 && e.completed_lessons === e.total_lessons).length;
  const progressionGlobale = enrollments.length > 0
    ? Math.round(enrollments.reduce((acc, e) => {
        return acc + (e.total_lessons > 0 ? (e.completed_lessons / e.total_lessons) * 100 : 0);
      }, 0) / enrollments.length)
    : 0;

  const handleFieldChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleToggle = async () => {
    if (editMode) {
      setSaving(true);
      setSaveError(null);
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ first_name: form.first_name, last_name: form.last_name }),
        });
        if (!res.ok) throw new Error('Échec de la sauvegarde');
        setEditMode(false);
      } catch (err) {
        setSaveError("La sauvegarde a échoué, réessayez.");
      } finally {
        setSaving(false);
      }
    } else {
      setEditMode(true);
    }
  };

  return (
    <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden', padding: '28px 32px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', margin: '0 0 4px' }}>Mon profil</h1>
          <p style={{ fontSize: '13px', color: GRAY }}>Informations personnelles et progression</p>
        </div>
        <button onClick={handleToggle} disabled={saving} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: BRAND, border: 'none', color: '#fff', borderRadius: '8px',
          padding: '10px 18px', fontSize: '13px', fontWeight: '600',
          cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1,
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          <Edit2 size={14} /> {saving ? 'Sauvegarde...' : editMode ? 'Sauvegarder' : 'Modifier'}
        </button>
      </div>
      {saveError && <div style={{ color: RED, fontSize: '12px', marginBottom: '16px' }}>{saveError}</div>}

      <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: '16px', padding: '28px', marginBottom: '20px', minWidth: 0, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', color: '#fff', flexShrink: 0 }}>
            {(user?.first_name || user?.email || '?')[0].toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.email?.split('@')[0]}
            </div>
            <div style={{ fontSize: '13px', color: GRAY, marginTop: '4px' }}>{user?.email}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', color: GRAY, marginBottom: '6px' }}>PRÉNOM</div>
            {editMode ? (
              <input value={form.first_name} onChange={e => handleFieldChange('first_name', e.target.value)} style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${CARD_BORDER}`, borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            ) : <div style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>{user?.first_name || '—'}</div>}
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', color: GRAY, marginBottom: '6px' }}>NOM</div>
            {editMode ? (
              <input value={form.last_name} onChange={e => handleFieldChange('last_name', e.target.value)} style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${CARD_BORDER}`, borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            ) : <div style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>{user?.last_name || '—'}</div>}
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', color: GRAY, marginBottom: '6px' }}>EMAIL</div>
            <div style={{ fontSize: '13px', color: '#fff', fontWeight: '500', wordBreak: 'break-word' }}>{user?.email || '—'}</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', color: GRAY, marginBottom: '6px' }}>LANGUE</div>
            <div style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>FR</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
        {[
          { label: 'PARCOURS ACTIFS', value: totalCours, color: BRAND },
          { label: 'COURS TERMINÉS', value: coursTermines, color: GREEN },
          { label: 'PROGRESSION GLOBALE', value: `${progressionGlobale}%`, color: '#c9a94e' },
        ].map((s, i) => (
          <div key={i} style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: '12px', padding: '20px', minWidth: 0, boxSizing: 'border-box' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', color: GRAY, marginBottom: '10px' }}>{s.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ===== DASHBOARD PRINCIPAL ===== */
const Dashboard = () => {
  const { token, loading, user } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('espace');
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  useEffect(() => {
    if (!loading && !token) navigate('/login');
  }, [token, loading]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/auth/me/enrollments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : [])
      .then(setEnrollments)
      .finally(() => setLoadingEnrollments(false));
  }, [token]);

  if (loading || !token) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: GRAY, fontSize: '14px', background: BG }}>Chargement...</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'espace': return <MonEspace enrollments={enrollments} loadingEnrollments={loadingEnrollments} user={user} />;
      case 'parcours': return <MesParcours enrollments={enrollments} loadingEnrollments={loadingEnrollments} />;
      case 'certificats': return <MesCertificats />;
      case 'profil': return <Profil user={user} enrollments={enrollments} token={token} />;
      default: return <MonEspace enrollments={enrollments} loadingEnrollments={loadingEnrollments} user={user} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minWidth: 0 }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
        {renderContent()}
      </div>
      <button style={{
        position: 'fixed', bottom: '20px', right: '20px', zIndex: 50,
        background: 'rgba(20,26,42,0.9)', border: `1px solid ${CARD_BORDER}`,
        color: GRAY, borderRadius: '999px', padding: '8px 16px',
        fontSize: '12px', cursor: 'pointer',
      }}>
        ← Vue admin
      </button>
    </div>
  );
};

export default Dashboard;