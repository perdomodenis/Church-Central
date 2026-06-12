import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  getNLSConfig, 
  updateNLSConfig, 
  registerForNLS, 
  unregisterFromNLS, 
  checkNLSRegistration, 
  getNLSRegistrations 
} from '../../services/nlsService';

const NLSScreen = ({ user }) => {
  const { t } = useLanguage();
  const { user: authUser } = useAuth();
  const level = user?.accessLevel || 1;

  const [config, setConfig] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Management Form State
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [authUser?.uid, level]);

  const loadData = async () => {
    setLoading(true);
    try {
      const conf = await getNLSConfig();
      if (conf) {
        setConfig(conf);
        setEditStartDate(conf.startDate || '');
        setEditEndDate(conf.endDate || '');
        setEditDeadline(conf.deadline || '');
      }

      if (level === 1) {
        const regStatus = await checkNLSRegistration(authUser?.uid);
        setIsRegistered(regStatus);
      } else if (level >= 3) {
        const regs = await getNLSRegistrations();
        setRegistrations(regs);
      }
    } catch (error) {
      console.error('Error loading NLS data:', error);
    }
    setLoading(false);
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateNLSConfig(editStartDate, editEndDate, editDeadline);
      setConfig({ startDate: editStartDate, endDate: editEndDate, deadline: editDeadline });
      alert('Schedule updated successfully!');
    } catch (error) {
      alert('Failed to update schedule: ' + error.message);
    }
    setIsSaving(false);
  };

  const handleRegister = async () => {
    try {
      await registerForNLS(authUser.uid, {
        name: authUser.displayName || 'Visitor',
        email: authUser.email || ''
      });
      setIsRegistered(true);
      alert('Successfully registered for New Life School!');
    } catch (error) {
      alert('Error registering: ' + error.message);
    }
  };

  const handleUnregister = async () => {
    try {
      await unregisterFromNLS(authUser.uid);
      setIsRegistered(false);
      alert('Registration cancelled.');
    } catch (error) {
      alert('Error cancelling registration: ' + error.message);
    }
  };

  if (level === 2) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#666' }}>
        <h3>Access Denied</h3>
        <p>You are already a member. The New Life School is for initiating visitors.</p>
      </div>
    );
  }

  if (loading) {
    return <div style={{ padding: '32px', textAlign: 'center' }}>Loading...</div>;
  }

  // --- Visitor View (Level 1) ---
  if (level === 1) {
    const isPastDeadline = config?.deadline ? new Date(config.deadline) < new Date() : false;

    return (
      <div style={{ padding: '24px', paddingBottom: '100px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#111', margin: '0 0 12px 0' }}>New Life School</h2>
          <p style={{ color: '#555', fontSize: '1.1rem', lineHeight: '1.5' }}>
            {t('nlsDescription') || 'New Life School is our foundational course series designed to equip believers with essential biblical principles.'}
          </p>
        </div>

        {config ? (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>Upcoming Cohort</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={detailRowStyle}>
                <span style={{ fontSize: '1.2rem' }}>📅</span>
                <div>
                  <div style={{ fontWeight: '600', color: '#333' }}>Dates</div>
                  <div style={{ color: '#666' }}>{config.startDate} to {config.endDate}</div>
                </div>
              </div>
              <div style={detailRowStyle}>
                <span style={{ fontSize: '1.2rem' }}>⏰</span>
                <div>
                  <div style={{ fontWeight: '600', color: '#333' }}>Registration Deadline</div>
                  <div style={{ color: isPastDeadline ? '#e53935' : '#666', fontWeight: isPastDeadline ? 'bold' : 'normal' }}>
                    {config.deadline} {isPastDeadline && '(Closed)'}
                  </div>
                </div>
              </div>
            </div>

            {isRegistered ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '16px', borderRadius: '12px', fontWeight: 'bold', marginBottom: '16px' }}>
                  ✅ You are successfully registered!
                </div>
                <button onClick={handleUnregister} style={secondaryButtonStyle}>
                  Cancel Registration
                </button>
              </div>
            ) : isPastDeadline ? (
              <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '16px', borderRadius: '12px', textAlign: 'center', fontWeight: '500' }}>
                Registration is currently closed. Please check back later for the next cohort!
              </div>
            ) : (
              <button onClick={handleRegister} style={primaryButtonStyle}>
                Register Now
              </button>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#999', padding: '32px', backgroundColor: '#f9f9f9', borderRadius: '16px' }}>
            No upcoming New Life School cohorts are currently scheduled.
          </div>
        )}
      </div>
    );
  }

  // --- Management View (Level 3+) ---
  return (
    <div style={{ padding: '24px', paddingBottom: '100px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0 0 8px 0', color: '#111' }}>📚 NLS Management Dashboard</h2>
      <p style={{ color: '#666', marginBottom: '32px' }}>Manage the current New Life School cohort and view registries.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Settings Card */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: 'var(--accent)' }}>Cohort Settings</h3>
          <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={labelStyle}>Start Date</label>
                <input type="date" value={editStartDate} onChange={e => setEditStartDate(e.target.value)} required style={inputStyle} />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={labelStyle}>End Date</label>
                <input type="date" value={editEndDate} onChange={e => setEditEndDate(e.target.value)} required style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Registration Deadline</label>
              <input type="date" value={editDeadline} onChange={e => setEditDeadline(e.target.value)} required style={inputStyle} />
            </div>
            <button type="submit" disabled={isSaving} style={{ ...primaryButtonStyle, marginTop: '8px', alignSelf: 'flex-start', padding: '10px 24px' }}>
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>

        {/* Registrations Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--accent)' }}>Recent Registries</h3>
            <div style={{ backgroundColor: 'var(--accent-light, #e0d4ff)', color: 'var(--accent)', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
              {registrations.length} Total
            </div>
          </div>
          
          {registrations.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '24px 0', margin: 0 }}>No one has registered yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '12px 8px', color: '#666', fontWeight: '600' }}>Name</th>
                    <th style={{ padding: '12px 8px', color: '#666', fontWeight: '600' }}>Email</th>
                    <th style={{ padding: '12px 8px', color: '#666', fontWeight: '600' }}>Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map(reg => (
                    <tr key={reg.userId} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px 8px', fontWeight: '500', color: '#111' }}>{reg.name}</td>
                      <td style={{ padding: '12px 8px', color: '#555' }}>{reg.email}</td>
                      <td style={{ padding: '12px 8px', color: '#888', fontSize: '0.9rem' }}>{new Date(reg.registeredAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  border: '1px solid #f0f0f0'
};

const detailRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  backgroundColor: '#f9f9f9',
  padding: '16px',
  borderRadius: '12px'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#333',
  marginBottom: '6px'
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '1rem',
  boxSizing: 'border-box'
};

const primaryButtonStyle = {
  width: '100%',
  padding: '14px',
  backgroundColor: 'var(--accent)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontWeight: '700',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s'
};

const secondaryButtonStyle = {
  width: '100%',
  padding: '14px',
  backgroundColor: 'transparent',
  color: '#d32f2f',
  border: '1px solid #d32f2f',
  borderRadius: '12px',
  fontWeight: '700',
  fontSize: '1rem',
  cursor: 'pointer'
};

export default NLSScreen;
