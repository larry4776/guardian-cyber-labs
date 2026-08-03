import React, { createContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Au chargement de l'app, si un token existe déjà (session précédente), on vérifie qu'il est toujours valide
  useEffect(() => {
    const savedToken = sessionStorage.getItem('avalon_token');
    if (savedToken) {
      fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${savedToken}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Session expirée');
          return res.json();
        })
        .then(userData => {
          setUser(userData);
          setToken(savedToken);
        })
        .catch(() => {
          sessionStorage.removeItem('avalon_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (accessToken, userData) => {
    sessionStorage.setItem('avalon_token', accessToken);
    setToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem('avalon_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};