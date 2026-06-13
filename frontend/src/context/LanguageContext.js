import React, { createContext, useState, useEffect } from 'react';
import translations from '../services/translations';

const LanguageContext = createContext();

const setLanguage = () => {};

const t = (key) => {
  return translations.en?.[key] || key;
};

export const LanguageProvider = ({ children }) => {
  const language = 'en';

  useEffect(() => {
    localStorage.removeItem('appLanguage');
  }, []);

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
