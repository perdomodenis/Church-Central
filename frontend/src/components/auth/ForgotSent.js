import React from 'react';

const ForgotSent = ({ email, onBack }) => {
  return (
    <div className="forgot-sent" style={{ 
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
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✉️</div>
      
      <h1 style={{ color: 'var(--accent)', fontSize: '2.5rem', marginBottom: '16px' }}>Check your email</h1>
      
      <p style={{ opacity: 0.8, fontSize: '1.1rem', marginBottom: '32px', lineHeight: '1.5' }}>
        We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions to reset your password.
      </p>

      <button 
        onClick={onBack}
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
        Return to Sign In
      </button>
    </div>
  );
};

export default ForgotSent;