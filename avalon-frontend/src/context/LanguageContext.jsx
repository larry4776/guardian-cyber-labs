import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('gcl_lang') || 'fr');

  useEffect(() => {
    localStorage.setItem('gcl_lang', language);
  }, [language]);

  const toggleLanguage = () => setLanguage(prev => prev === 'fr' ? 'en' : 'fr');

  // Renvoie le texte FR ou EN, avec repli automatique sur le FR si l'EN n'est pas encore rempli
  const t = (obj, fieldFr, fieldEn) => {
    if (language === 'en' && obj[fieldEn]) return obj[fieldEn];
    return obj[fieldFr];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};