import React, { useState, useEffect } from 'react';
import { rtdb } from '../../services/firebase';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '../../context/AuthContext';
import { registerForBaptism, unregisterFromBaptism, checkBaptismRegistration } from '../../services/baptismService';
import AddBaptismModal from './AddBaptismModal';
import { useLanguage } from '../../context/LanguageContext';

const BaptismScreen = ({ user }) => {
  const { user: authUser } = useAuth();
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const eventsRef = ref(rtdb, 'baptisms/events');

    const unsubscribe = onValue(eventsRef, async (snapshot) => {
      if (snapshot.exists()) {
        const eventsData = snapshot.val();
        const eventsList = Object.entries(eventsData).map(([key, value]) => ({
          id: key,
          ...value
        })).sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

        setEvents(eventsList);

        const regs = {};
        await Promise.all(eventsList.map(async (event) => {
          const isRegistered = await checkBaptismRegistration(event.id, authUser?.uid);
          regs[event.id] = isRegistered;
        }));
        setRegistrations(regs);
      } else {
        setEvents([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authUser?.uid]);

  const handleRegister = async (eventId) => {
    try {
      await registerForBaptism(eventId, authUser.uid, authUser.displayName || 'User', authUser.email);
      setRegistrations(prev => ({ ...prev, [eventId]: true }));
      
      setEvents(prev =>
        prev.map(e =>
          e.id === eventId ? { ...e, attendees: (e.attendees || 0) + 1 } : e
        )
      );
    } catch (error) {
      alert('Error registering: ' + error.message);
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      await unregisterFromBaptism(eventId, authUser.uid);
      setRegistrations(prev => ({ ...prev, [eventId]: false }));
      
      setEvents(prev =>
        prev.map(e =>
          e.id === eventId ? { ...e, attendees: Math.max(0, (e.attendees || 0) - 1) } : e
        )
      );
    } catch (error) {
      alert('Error unregistering: ' + error.message);
    }
  };

  const handleEventAdded = (newEvent) => {
    setEvents(prev => [...prev, newEvent].sort((a, b) => 
      new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
    ));
    setShowAddModal(false);
  };

  return (
    <div style={{ padding: '16px', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: '#111' }}>💧 {t('waterBaptism')}</h2>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: '4px 0 0 0' }}>{t('registerForBaptismEvent')}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            backgroundColor: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          + {t('addEvent')}
        </button>
      </div>

      {/* Info Section */}
      <div style={infoCardStyle}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: '700' }}>{t('whatIsBaptism')}</h3>
        <p style={{ margin: 0, color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>
          {t('baptismDescription')}
        </p>
      </div>

      {/* Events List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
          {t('loading')}
        </div>
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
          {t('noBaptismEvents')}
        </div>
      ) : (
        events.map(event => (
          <div key={event.id} style={eventCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#111' }}>
                {event.title}
              </h3>
              <div style={{
                backgroundColor: 'rgba(91, 63, 187, 0.1)',
                color: 'var(--accent)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                👥 {event.attendees || 0} {t('attending')}
              </div>
            </div>

            <div style={eventInfoStyle}>
              <span>📅 {event.date} at {event.time}</span>
              <span style={{ marginLeft: '16px' }}>📍 {event.location}</span>
            </div>

            {event.description && (
              <p style={{ margin: '8px 0', color: '#555', fontSize: '0.9rem' }}>
                {event.description}
              </p>
            )}

            <div style={{ marginTop: '12px' }}>
              {registrations[event.id] ? (
                <button
                  onClick={() => handleUnregister(event.id)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  ✓ {t('registeredBaptism')} - {t('cancelRegistration')}
                </button>
              ) : (
                <button
                  onClick={() => handleRegister(event.id)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  {t('registerForBaptism')}
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {showAddModal && (
        <AddBaptismModal
          onClose={() => setShowAddModal(false)}
          onEventAdded={handleEventAdded}
          user={authUser}
        />
      )}
    </div>
  );
};

const infoCardStyle = {
  backgroundColor: 'rgba(91, 63, 187, 0.08)',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '24px',
  border: '1px solid rgba(91, 63, 187, 0.1)'
};

const eventCardStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '16px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  border: '1px solid #f0f0f0'
};

const eventInfoStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  color: '#666',
  fontSize: '0.9rem',
  fontWeight: '500'
};

export default BaptismScreen;
