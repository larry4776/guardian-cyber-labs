import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

const SettingsContext = createContext({});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    currency: 'FCFA',
    stats_learners: '500+',
    stats_certified: '120+',
    stats_courses: '9',
    stats_rating: '4.8/5',
  });

  useEffect(() => {
    fetch(`${API_URL}/settings/`)
      .then(res => res.ok ? res.json() : {})
      .then(data => {
        if (Object.keys(data).length > 0) setSettings(prev => ({ ...prev, ...data }));
      })
      .catch(() => {});
  }, []);

  const formatPrice = (price, isFree, language) => {
    if (isFree) return language === 'fr' ? 'Gratuit' : 'Free';
    const currency = settings.currency || 'FCFA';
    if (currency === 'FCFA') return `${price.toLocaleString()} FCFA`;
    if (currency === 'USD') return `$${price}`;
    if (currency === 'EUR') return `${price} €`;
    return `${price} ${currency}`;
  };

  return (
    <SettingsContext.Provider value={{ settings, formatPrice }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);