import React, { createContext, useState, useEffect } from 'react';
import translations from '../services/translations';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const language = 'en';
  const setLanguage = () => {};

  useEffect(() => {
    localStorage.removeItem('appLanguage');
  }, []);

  const t = (key) => {
    return translations.en?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
