import React from 'react';

const SimpleScreen = ({ icon, title, subtitle }) => {
  const handleAction = () => {
    // This would typically navigate to a specific form or open a registration sheet
    alert(`Registration for ${title} will be available soon!`);
  };

  return (
    <div className="simple-screen" style={{ 
      padding: '40px 24px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      textAlign: 'center',
      minHeight: '70vh'
    }}>
      <div style={{ 
        fontSize: '4rem', 
        color: 'var(--accent)', 
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </div>

      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: '800', 
        marginBottom: '12px', 
        color: '#111' 
      }}>
        {title}
      </h1>

      <p style={{ 
        fontSize: '1.1rem', 
        color: '#666', 
        lineHeight: '1.6', 
        marginBottom: '40px',
        maxWidth: '300px'
      }}>
        {subtitle}
      </p>

      <button 
        onClick={handleAction}
        style={actionButtonStyle}
      >
        Get Involved
      </button>
    </div>
  );
};

const actionButtonStyle = {
  backgroundColor: 'var(--accent)',
  color: 'white',
  padding: '16px 40px',
  borderRadius: '12px',
  border: 'none',
  fontWeight: '700',
  fontSize: '1rem',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s'
};

export default SimpleScreen;