import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const WelcomeScreen = ({ name, onContinue }) => {
  const { t } = useLanguage();
  return (
    <div className="welcome-screen" style={{ 
      padding: '40px 20px', 
      maxWidth: '400px', 
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      minHeight: '80vh'
    }}>
      <div style={{ 
        fontSize: '4rem', 
        marginBottom: '20px',
        animation: 'popIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)' 
      }}>
        
      </div>
      
      <h1 style={{ color: 'var(--accent)', fontSize: '2.5rem', marginBottom: '16px' }}>
        {t('welcomeUser').replace('{name}', name)}
      </h1>
      
      <p style={{ opacity: 0.8, fontSize: '1.1rem', marginBottom: '32px', lineHeight: '1.5' }}>
        {t('welcomeUserMessage')}
      </p>

      <button 
        onClick={onContinue}
        style={{ 
          backgroundColor: 'var(--accent)', 
          color: 'white', 
          padding: '16px 32px', 
          borderRadius: '8px', 
          border: 'none', 
          fontWeight: '600', 
          fontSize: '1rem',
          cursor: 'pointer',
          width: '100%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        {t('getStarted')}
      </button>
    </div>
  );
};

export default WelcomeScreen;