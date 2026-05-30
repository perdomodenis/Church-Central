import React from 'react';

const ACCENT_PRESETS = [
  ['#5B3FBB', '#EFE9FF'],
  ['#C9974A', '#F6ECD8'],
  ['#2E6B5E', '#E1EFEB'],
  ['#1F4D8F', '#E3ECF7'],
  ['#B8385E', '#FAE3EA'],
  ['#0F172A', '#E2E6EE'],
];

const SettingsScreen = ({ user, onBack, accentColor, setAccentColor, darkMode, setDarkMode }) => {
  return (
    <div className="settings-screen" style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={backButtonStyle}>←</button>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, marginLeft: '12px' }}>Settings</h2>
      </div>

      {/* Account Section */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Account</h3>
        <div style={cardStyle}>
           <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>Logged in as</p>
           <p style={{ margin: '4px 0 0 0', fontWeight: '700', color: '#111' }}>{user.email}</p>
        </div>
      </div>

      {/* Appearance Section */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Appearance</h3>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <p style={{ margin: 0, fontWeight: '700', color: '#111' }}>Dark Mode</p>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#666' }}>Adjust the app's visual theme</p>
            </div>
            <input 
              type="checkbox" 
              checked={darkMode} 
              onChange={(e) => setDarkMode(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>

          <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', fontWeight: '700', color: '#111' }}>
            Accent Color
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {ACCENT_PRESETS.map(([color]) => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: color,
                  border: accentColor === color ? '3px solid white' : 'none',
                  boxShadow: accentColor === color ? `0 0 0 2px ${color}` : '0 2px 4px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  transform: accentColor === color ? 'scale(1.1)' : 'scale(1)'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Preferences</h3>
        <div style={cardStyle}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <span style={{ fontWeight: '700', color: '#111' }}>Push Notifications</span>
             <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
           </div>
        </div>
      </div>

      <div style={{ marginTop: '48px', textAlign: 'center', opacity: 0.4, fontSize: '0.75rem' }}>
        Church Central v1.0.4<br/>
        CCI Switzerland • Management System
      </div>
    </div>
  );
};

// Styles
const sectionStyle = { marginBottom: '32px' };

const sectionTitleStyle = { 
  fontSize: '0.75rem', 
  fontWeight: '800', 
  color: '#888', 
  textTransform: 'uppercase', 
  letterSpacing: '1px', 
  marginBottom: '12px', 
  marginLeft: '4px' 
};

const cardStyle = { 
  backgroundColor: 'white', 
  borderRadius: '16px', 
  padding: '20px', 
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)', 
  border: '1px solid #f0f0f0' 
};

const backButtonStyle = { 
  width: '40px', 
  height: '40px', 
  borderRadius: '12px', 
  border: 'none', 
  backgroundColor: '#f0f0f0', 
  fontSize: '1.2rem', 
  cursor: 'pointer', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center' 
};

export default SettingsScreen;