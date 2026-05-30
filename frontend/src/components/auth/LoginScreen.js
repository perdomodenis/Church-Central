import React, { useState } from 'react';

const LoginScreen = ({ onLogin, onSignup, onForgot }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin({ email, password });
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
        <p style={{ opacity: 0.7 }}>Sign in to your community</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>
            Email Address
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
            Password
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
          Sign In
        </button>
      </form>

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
