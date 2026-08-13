import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import CommunityLinks from '../components/CommunityLinks';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';
import { countries } from '../data/countries';

const Profile = () => {
  const { token, loading, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ firstName: '', lastName: '', country: '', phone: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [enrollments, setEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [pwPhase, setPwPhase] = useState('idle');
  const [codeInput, setCodeInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  useEffect(() => { if (!loading && !token) navigate('/login'); }, [token, loading]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setFormData({ firstName: data.first_name || '', lastName: data.last_name || '', country: data.country || '', phone: data.phone || '' }));

    fetch(`${API_URL}/auth/me/enrollments`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(setEnrollments)
      .finally(() => setLoadingEnrollments(false));

    fetch(`${API_URL}/certificates/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(setCertificates);
  }, [token]);

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.replace(/[^a-zA-ZÀ-ÿ\s-]/g, '') });
  };
  const handlePhoneChange = (e) => { setFormData({ ...formData, phone: e.target.value.replace(/[^0-9+\s]/g, '') }); };

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ first_name: formData.firstName, last_name: formData.lastName, country: formData.country, phone: formData.phone }),
      });
      if (!res.ok) throw new Error('Erreur lors de la mise à jour.');
      setProfileMsg('✓ Profil mis à jour.');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) { setProfileMsg(err.message); }
  };

  const requestCode = async () => {
    setPasswordMsg('');
    try {
      await fetch(`${API_URL}/auth/request-password-change-code`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` },
      });
      setPwPhase('code-sent');
    } catch { setPasswordMsg('Erreur lors de la génération du code.'); }
  };

  const confirmChange = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    if (newPassword !== confirmPassword) { setPasswordMsg('Les mots de passe ne correspondent pas.'); return; }
    try {
      const res = await fetch(`${API_URL}/auth/confirm-password-change`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: codeInput, new_password: newPassword }),
      });
      if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data.detail || 'Erreur.'); }
      setPasswordMsg('✓ Mot de passe modifié.');
      setPwPhase('idle');
      setCodeInput(''); setNewPassword(''); setConfirmPassword('');
      setTimeout(() => setPasswordMsg(''), 3000);
    } catch (err) { setPasswordMsg(err.message); }
  };

  const toggleCertVisibility = async (certId, current) => {
    await fetch(`${API_URL}/certificates/${certId}/visibility`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_public: !current }),
    });
    setCertificates(certificates.map(c => c.id === certId ? { ...c, is_public: !current } : c));
  };

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  if (loading || !token) return <div className="min-h-screen flex items-center justify-center text-muted text-sm">Chargement...</div>;

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-10">

        <div>
          <h1 className="font-display text-2xl font-bold mb-1 tracking-tight">Mon profil</h1>
          <p className="text-muted text-sm">{user?.email}</p>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Informations personnelles</h3>
          {profileMsg && <div className={`text-sm rounded-lg px-4 py-3 ${profileMsg.startsWith('✓') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>{profileMsg}</div>}
          <form onSubmit={saveProfile} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input name="firstName" type="text" placeholder="Prénom" value={formData.firstName} onChange={handleNameChange}
                className="bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />
              <input name="lastName" type="text" placeholder="Nom" value={formData.lastName} onChange={handleNameChange}
                className="bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors">
                <option value="">Pays</option>
                {countries.map(c => <option key={c.name} value={c.name}>{c.name} ({c.code})</option>)}
              </select>
              <input type="tel" placeholder="Téléphone" value={formData.phone} onChange={handlePhoneChange}
                className="bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />
            </div>
            <button type="submit" className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-shadow">
              Enregistrer
            </button>
          </form>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Mes formations</h3>
            <span className="text-xs text-muted">{enrollments.length} cours achetés</span>
          </div>
          {loadingEnrollments ? (
            <p className="text-muted text-sm">Chargement...</p>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted text-sm mb-3">Aucune formation pour l'instant.</p>
              <Link to="/catalog" className="text-primary-light hover:text-white font-semibold text-sm">Découvrir le catalogue →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.map(e => {
                const percent = e.total_lessons > 0 ? Math.round((e.completed_lessons / e.total_lessons) * 100) : 0;
                return (
                  <div key={e.course_id} className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">{e.course_title}</span>
                      <span className="text-[11px] text-muted uppercase font-semibold">{e.payment_method || 'Gratuit'}</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>{e.completed_lessons} / {e.total_lessons} leçons — {percent}%</span>
                      <span>Acheté le {formatDate(e.purchased_at)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {certificates.length > 0 && (
          <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award size={16} className="text-primary-light" /> Mes certificats
            </h3>
            {certificates.map(cert => (
              <div key={cert.id} className="bg-white/[0.02] border border-white/10 rounded-lg p-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm font-semibold text-white">{cert.course_title}</p>
                  <p className="text-xs text-muted">Code : {cert.code}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="flex items-center gap-2 text-xs text-slate-400">
                    <input type="checkbox" checked={cert.is_public} onChange={() => toggleCertVisibility(cert.id, cert.is_public)} className="accent-primary" />
                    Public
                  </label>
                  <a href={`${API_URL}/certificates/${cert.id}/pdf`} target="_blank" rel="noopener noreferrer"
                    className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-shadow">
                    Télécharger
                  </a>
                  <a href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.course_title)}&organizationName=AVALON+SECURE&certUrl=${encodeURIComponent(`https://guardian-cyber-labs.netlify.app/certificates/verify/${cert.code}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                    LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Changer le mot de passe</h3>
          {passwordMsg && <div className={`text-sm rounded-lg px-4 py-3 ${passwordMsg.startsWith('✓') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>{passwordMsg}</div>}
          {pwPhase === 'idle' ? (
            <button onClick={requestCode} className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-shadow">
              Recevoir un code pour changer le mot de passe
            </button>
          ) : (
            <>
              <div className="bg-primary/10 border border-primary/30 text-primary-light text-xs rounded-lg px-4 py-3">
                Un code de vérification a été envoyé à ton adresse email.
              </div>
              <form onSubmit={confirmChange} className="space-y-3">
                <input type="text" maxLength={6} placeholder="Code à 6 chiffres" value={codeInput} onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white/[0.03] border border-white/10 text-white text-center text-xl tracking-[0.4em] px-4 py-3 rounded-lg outline-none focus:border-primary/50 transition-colors" />
                <input type="password" placeholder="Nouveau mot de passe" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />
                <input type="password" placeholder="Confirmer le nouveau mot de passe" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors" />
                <button type="submit" className="bg-gradient-to-r from-primary to-primary-dark hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-shadow">
                  Confirmer le changement
                </button>
              </form>
            </>
          )}
        </div>

        <CommunityLinks />
      </div>
    </div>
  );
};
export default Profile;