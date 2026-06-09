import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LoginScreen = ({ onLogin, onSignup, onForgot, onGoogleLogin }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin({ email, password });
    }
  };

  const handleGoogleClick = async () => {
    setLoading(true);
    try {
      await onGoogleLogin();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen" style={{
      padding: '0',
      margin: '0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 600%22%3E%3Crect fill=%22%23667eea%22 width=%221200%22 height=%22600%22/%3E%3Ccircle cx=%22200%22 cy=%22100%22 r=%2280%22 fill=%22rgba(255,255,255,0.1)%22/%3E%3Ccircle cx=%221000%22 cy=%22500%22 r=%22120%22 fill=%22rgba(255,255,255,0.05)%22/%3E%3Cpath d=%22M0 300 Q300 200 600 300 T1200 300%22 stroke=%22rgba(255,255,255,0.1)%22 stroke-width=%222%22 fill=%22none%22/%3E%3C/svg%3E")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.3,
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '40px 20px',
        maxWidth: '400px',
        margin: '0 auto',
        width: '100%'
      }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⛪</div>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '8px', fontWeight: '800' }}>Church Central</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>{t('welcome')}</p>
      </div>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: 'white',
        padding: '28px',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
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
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outlineColor: 'var(--accent)' }}
          />
        </div>

        <div className="input-group">
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
            {t('password')}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outlineColor: 'var(--accent)' }}
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
          {t('signIn')}
        </button>
      </form>

      <div style={{ marginTop: '24px', position: 'relative', backgroundColor: 'white', padding: '28px', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
          <span style={{ fontSize: '0.85rem', color: '#999' }}>{t('or')}</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            backgroundColor: '#f9f9f9',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '1rem',
            opacity: loading ? 0.6 : 1
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🔵</span>
          {loading ? t('signingIn') : t('signInWithGoogle')}
        </button>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
          <button onClick={onForgot} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}>
            {t('forgotPassword')}
          </button>
          <p style={{ marginTop: '12px', color: '#666' }}>
            {t('dontHaveAccount')} {' '}
            <button onClick={onSignup} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 'bold', cursor: 'pointer' }}>
              {t('signUpHere')}
            </button>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default LoginScreen;
