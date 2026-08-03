import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const CommunityLinks = () => {
  const { language } = useContext(LanguageContext);
  const fr = language === 'fr';

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
      <h3 className="text-sm font-bold text-white">{fr ? 'Rejoins la communauté' : 'Join the community'}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">
        {fr ? 'Échange avec d\'autres apprenants et l\'équipe pédagogique.' : 'Connect with other learners and the teaching team.'}
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <a href="https://whatsapp.com/channel/0029Va8oNXf3WHTQ8MIJzS2T" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 font-semibold text-sm px-4 py-3 rounded-lg transition-colors">
          WhatsApp
        </a>
        <a href="https://www.linkedin.com/company/avalon-secure/" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/30 text-blue-400 font-semibold text-sm px-4 py-3 rounded-lg transition-colors">
          LinkedIn
        </a>
      </div>
    </div>
  );
};
export default CommunityLinks;