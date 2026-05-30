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
      padding: '40px 20px', 
      maxWidth: '400px', 
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '80vh'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'var(--accent)', fontSize: '2.5rem', marginBottom: '8px' }}>Church Central</h1>
        <p style={{ opacity: 0.7 }}>{t('welcome')}</p>
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

      <div style={{ marginTop: '24px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
          <span style={{ fontSize: '0.85rem', color: '#999' }}>or</span>
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
            backgroundColor: 'white',
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
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>

      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
        <button onClick={onForgot} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }}>
          Forgot your password?
        </button>
        <p style={{ marginTop: '16px' }}>
          Don't have an account? {' '}
          <button onClick={onSignup} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 'bold', cursor: 'pointer' }}>
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
