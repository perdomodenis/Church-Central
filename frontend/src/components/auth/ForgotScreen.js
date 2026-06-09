import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const ForgotScreen = ({ onBack, onSent }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      onSent(email);
    }
  };

  return (
    <div className="forgot-screen" style={{ 
      padding: '40px 20px', 
      maxWidth: '400px', 
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '80vh'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'var(--accent)', fontSize: '2.5rem', marginBottom: '8px' }}>{t('resetPassword')}</h1>
        <p style={{ opacity: 0.7 }}>{t('resetPasswordInstructions')}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
            {t('email')}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '8px', 
              border: '1px solid #ddd', 
              outlineColor: 'var(--accent)',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button 
          type="submit" 
          style={{ 
            backgroundColor: 'var(--accent)', 
            color: 'white', 
            padding: '14px', 
            borderRadius: '8px', 
            border: 'none', 
            fontWeight: '600', 
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          {t('sendResetLink')}
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: '500' }}>
          ← {t('backToSignIn')}
        </button>
      </div>
    </div>
  );
};

export default ForgotScreen;