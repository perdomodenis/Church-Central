import React from 'react';

const WelcomeScreen = ({ name, onContinue }) => {
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
        animation: 'bounce 2s infinite' 
      }}>
        🎉
      </div>
      
      <h1 style={{ color: 'var(--accent)', fontSize: '2.5rem', marginBottom: '16px' }}>
        Welcome, {name}!
      </h1>
      
      <p style={{ opacity: 0.8, fontSize: '1.1rem', marginBottom: '32px', lineHeight: '1.5' }}>
        We're so glad you've joined the Church Central family. Your account has been successfully created and you're ready to start connecting with your community.
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
        Get Started
      </button>
    </div>
  );
};

export default WelcomeScreen;