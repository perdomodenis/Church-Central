import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LANGUAGES = [
  { code: 'en', name: '🇬🇧 English', flag: '🇬🇧' },
  { code: 'es', name: '🇪🇸 Español', flag: '🇪🇸' },
  { code: 'de', name: '🇩🇪 Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: '🇫🇷 Français', flag: '🇫🇷' },
  { code: 'it', name: '🇮🇹 Italiano', flag: '🇮🇹' },
  { code: 'pt', name: '🇵🇹 Português', flag: '🇵🇹' },
  { code: 'ln', name: '🇨🇩 Lingala', flag: '🇨🇩' }
];

const LanguageModal = ({ onClose }) => {
  const { setLanguage } = useLanguage();

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    onClose();
  };


  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: '#111' }}>
            Choose Language
          </h2>
          <p style={{ color: '#666', fontSize: '0.85rem', margin: '8px 0 0 0', lineHeight: '1.4' }}>
            Select language / Selecciona un idioma / Wähle eine Sprache / Choisir une langue / Seleziona una lingua / Selecione um idioma / Pona lokota
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: '2px solid #eee',
                backgroundColor: 'white',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#111',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--accent)';
                e.target.style.backgroundColor = 'rgba(91, 63, 187, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#eee';
                e.target.style.backgroundColor = 'white';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: '20px',
            width: '100%',
            padding: '12px',
            backgroundColor: '#f0f0f0',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            color: '#333'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3000
};

const modalStyle = {
  backgroundColor: 'white',
  borderRadius: '20px',
  padding: '24px',
  maxWidth: '400px',
  width: '90%',
  boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
};

export default LanguageModal;
