import React, { useState, useEffect, useContext } from 'react';
import { Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import { LanguageContext } from '../context/LanguageContext';
import { API_URL } from '../config';

const DOMAIN_LABELS = { red_team: { fr: 'Red Team', en: 'Red Team' }, blue_team: { fr: 'Blue Team', en: 'Blue Team' }, grc: { fr: 'GRC', en: 'GRC' } };
const LEVEL_LABELS = { beginner: { fr: 'Débutant', en: 'Beginner' }, intermediate: { fr: 'Intermédiaire', en: 'Intermediate' }, advanced: { fr: 'Avancé', en: 'Advanced' } };

const PublicCertificates = () => {
  const { language } = useContext(LanguageContext);
  const fr = language === 'fr';
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/certificates/public`)
      .then(res => res.ok ? res.json() : [])
      .then(setCertificates)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso) => new Date(iso).toLocaleDateString(fr ? 'fr-FR' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold mb-1">{fr ? 'Nos certifiés' : 'Our certified students'}</h1>
        <p className="text-slate-500 text-sm mb-10">
          {fr ? 'Étudiants ayant validé un parcours GUARDIAN CYBER LABS.' : 'Students who completed a GUARDIAN CYBER LABS course.'}
        </p>

        {loading ? (
          <p className="text-slate-500 text-sm">{fr ? 'Chargement...' : 'Loading...'}</p>
        ) : certificates.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm">
            {fr ? 'Aucun certifié public pour l\'instant.' : 'No public certificate yet.'}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {certificates.map((cert, i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Award size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-bold">{cert.student_name}</p>
                  <p className="text-slate-400 text-sm">{cert.course_title}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
                      {DOMAIN_LABELS[cert.domain]?.[language] || cert.domain}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-slate-800 text-slate-400">
                      {LEVEL_LABELS[cert.level]?.[language] || cert.level}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs mt-2">{formatDate(cert.issued_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default PublicCertificates;