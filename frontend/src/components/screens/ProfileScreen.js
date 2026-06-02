import React from 'react';

const ProfileScreen = ({ user, onSettings, onLogout }) => {
  const initials = `${user.first?.[0] || ''}${user.last?.[0] || ''}`.toUpperCase() || '??';

  return (
    <div className="profile-screen" style={{ padding: '24px', paddingBottom: '100px' }}>
      {/* Header / Avatar Section */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        marginBottom: '32px',
        textAlign: 'center' 
      }}>
        <div style={avatarStyle}>
          {initials}
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '12px 0 4px 0', color: '#111' }}>
          {user.first} {user.last}
        </h2>
        <p style={{ color: '#666', fontSize: '1rem', margin: 0 }}>{user.email}</p>
      </div>

      {/* Church Details Card */}
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>Community Roles</h3>
        
        <div style={infoRowStyle}>
          <span style={labelStyle}>Location / Court</span>
          <span style={valueStyle}>{user.court || 'Not specified'}</span>
        </div>
        
        <div style={infoRowStyle}>
          <span style={labelStyle}>Department</span>
          <span style={valueStyle}>{user.dept || 'Not specified'}</span>
        </div>
        
        <div style={infoRowStyle}>
          <span style={labelStyle}>Position</span>
          <span style={valueStyle}>{user.position || 'Not specified'}</span>
        </div>
      </div>

      {/* Interests Section */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={sectionTitleStyle}>Interests</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          {user.interests && user.interests.length > 0 ? (
            user.interests.map((interest, idx) => (
              <span key={idx} style={interestTagStyle}>
                {interest}
              </span>
            ))
          ) : (
            <p style={{ fontSize: '0.9rem', color: '#999', fontStyle: 'italic' }}>No interests added yet.</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button onClick={onSettings} style={primaryButtonStyle}>
          Account Settings
        </button>
        <button onClick={onLogout} style={logoutButtonStyle}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

// Styles
const avatarStyle = {
  width: '100px',
  height: '100px',
  borderRadius: '50px',
  backgroundColor: 'var(--accent)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2.5rem',
  fontWeight: '800',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
};

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '20px',
  marginBottom: '32px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  border: '1px solid #f0f0f0'
};

const sectionTitleStyle = {
  fontSize: '1.1rem',
  fontWeight: '700',
  color: '#111',
  margin: '0 0 16px 0',
  borderBottom: '1px solid #eee',
  paddingBottom: '8px'
};

const infoRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '12px'
};

const labelStyle = { color: '#666', fontSize: '0.9rem', fontWeight: '500' };
const valueStyle = { color: '#111', fontSize: '0.9rem', fontWeight: '700' };

const interestTagStyle = {
  backgroundColor: 'rgba(91, 63, 187, 0.08)',
  color: 'var(--accent)',
  padding: '6px 14px',
  borderRadius: '100px',
  fontSize: '0.85rem',
  fontWeight: '600'
};

const primaryButtonStyle = { width: '100%', padding: '16px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' };

const logoutButtonStyle = { width: '100%', padding: '16px', backgroundColor: '#FFF0F0', color: '#D32F2F', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' };

export default ProfileScreen;