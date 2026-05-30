import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { ref, set, get, remove } from 'firebase/database';

const BaptismScreen = ({ user }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkRegistration();
  }, [user?.uid]);

  const checkRegistration = async () => {
    if (!user?.uid) return;
    try {
      const snapshot = await get(ref(db, `baptisms/${user.uid}`));
      setIsRegistered(!!snapshot.val());
    } catch (error) {
      console.error('Error checking registration:', error);
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!user?.uid) return;
    try {
      await set(ref(db, `baptisms/${user.uid}`), {
        name: `${user.first} ${user.last}`,
        email: user.email,
        timestamp: new Date().toISOString(),
        status: 'registered'
      });
      setIsRegistered(true);
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  const handleUnregister = async () => {
    if (!user?.uid) return;
    try {
      await remove(ref(db, `baptisms/${user.uid}`));
      setIsRegistered(false);
    } catch (error) {
      console.error('Error unregistering:', error);
    }
  };

  return (
    <div style={{ padding: '24px', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px',
        backgroundColor: 'rgba(91, 63, 187, 0.08)',
        padding: '24px',
        borderRadius: '16px'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>💧</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 8px 0', color: '#111' }}>
          Water Baptism
        </h2>
        <p style={{ color: '#666', fontSize: '0.95rem', margin: 0 }}>
          Register for your water baptism ceremony
        </p>
      </div>

      {/* About Section */}
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>What is Water Baptism?</h3>
        <p style={textStyle}>
          Water baptism is a public declaration of your faith in Jesus Christ. It's an important step in your spiritual journey and represents your commitment to follow Christ and be part of our church community.
        </p>
      </div>

      {/* Details Section */}
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>Baptism Details</h3>

        <div style={infoBoxStyle}>
          <div style={{ fontSize: '1.5rem', marginRight: '12px' }}>📅</div>
          <div>
            <p style={labelStyle}>Date & Time</p>
            <p style={valueStyle}>Sundays after service or as scheduled</p>
          </div>
        </div>

        <div style={infoBoxStyle}>
          <div style={{ fontSize: '1.5rem', marginRight: '12px' }}>📍</div>
          <div>
            <p style={labelStyle}>Location</p>
            <p style={valueStyle}>Church baptismal pool or designated water source</p>
          </div>
        </div>

        <div style={infoBoxStyle}>
          <div style={{ fontSize: '1.5rem', marginRight: '12px' }}>⏱️</div>
          <div>
            <p style={labelStyle}>Preparation</p>
            <p style={valueStyle}>Arrive 15 minutes early. Bring a change of clothes</p>
          </div>
        </div>
      </div>

      {/* Requirements Section */}
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>Requirements</h3>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#333' }}>
          <li style={{ marginBottom: '8px' }}>Have accepted Jesus Christ as your Savior</li>
          <li style={{ marginBottom: '8px' }}>Have made a personal decision to follow Him</li>
          <li style={{ marginBottom: '8px' }}>Be able to publicly declare your faith</li>
          <li>Be physically capable of water baptism</li>
        </ul>
      </div>

      {/* Registration Section */}
      <div style={{
        ...cardStyle,
        backgroundColor: isRegistered ? 'rgba(46, 107, 94, 0.08)' : 'white',
        borderColor: isRegistered ? '#2E6B5E' : '#f0f0f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '1.5rem', marginRight: '12px' }}>
            {isRegistered ? '✅' : '📝'}
          </div>
          <h3 style={{ ...sectionTitleStyle, margin: 0 }}>
            {isRegistered ? 'You are registered!' : 'Register for Baptism'}
          </h3>
        </div>

        {isRegistered ? (
          <>
            <p style={{ color: '#2E6B5E', fontWeight: '600', marginBottom: '16px' }}>
              Thank you for signing up! We're excited to see you at the baptism.
            </p>
            <button
              onClick={handleUnregister}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#FFF0F0',
                color: '#D32F2F',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Cancel Registration
            </button>
          </>
        ) : (
          <>
            {loading ? (
              <p style={{ color: '#999' }}>Loading...</p>
            ) : (
              <>
                <p style={{ color: '#666', marginBottom: '16px', fontSize: '0.95rem' }}>
                  Ready to take this step? Click below to register for water baptism.
                </p>
                <button
                  onClick={handleRegister}
                  style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  Register for Baptism
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* Contact Section */}
      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>Questions?</h3>
        <p style={{ color: '#666', fontSize: '0.95rem', margin: 0 }}>
          Contact our pastoral team for more information about water baptism or to discuss any concerns.
        </p>
      </div>
    </div>
  );
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

const textStyle = {
  color: '#555',
  fontSize: '0.95rem',
  lineHeight: '1.6',
  margin: 0
};

const infoBoxStyle = {
  display: 'flex',
  marginBottom: '16px',
  paddingBottom: '16px',
  borderBottom: '1px solid #eee'
};

const labelStyle = {
  color: '#666',
  fontSize: '0.85rem',
  fontWeight: '600',
  margin: '0 0 4px 0'
};

const valueStyle = {
  color: '#111',
  fontSize: '0.95rem',
  fontWeight: '500',
  margin: 0
};

export default BaptismScreen;
