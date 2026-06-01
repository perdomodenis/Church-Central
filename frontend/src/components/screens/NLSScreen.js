import React, { useState, useEffect } from 'react';
import { rtdb } from '../../services/firebase';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '../../context/AuthContext';
import { registerForNLS, unregisterFromNLS, checkNLSRegistration } from '../../services/nlsService';
import AddNLSModal from './AddNLSModal';

const NLSScreen = ({ user }) => {
  const { user: authUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const eventsRef = ref(rtdb, 'nls/events');

    const unsubscribe = onValue(eventsRef, async (snapshot) => {
      if (snapshot.exists()) {
        const eventsData = snapshot.val();
        const eventsList = Object.entries(eventsData).map(([key, value]) => ({
          id: key,
          ...value
        })).sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

        setEvents(eventsList);

        const regs = {};
        for (const event of eventsList) {
          const isRegistered = await checkNLSRegistration(event.id, authUser?.uid);
          regs[event.id] = isRegistered;
        }
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
      await registerForNLS(eventId, authUser.uid, authUser.displayName || 'User', authUser.email);
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
      await unregisterFromNLS(eventId, authUser.uid);
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: '#111' }}>📚 New Life School</h2>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Register for upcoming NLS classes</p>
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
          + Add Class
        </button>
      </div>

      {/* Info Section */}
      <div style={infoCardStyle}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: '700' }}>What is New Life School (NLS)?</h3>
        <p style={{ margin: 0, color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>
          New Life School is our foundational course series designed to equip believers with essential biblical principles. Whether you're new to the faith or looking to deepen your roots, NLS provides the structured learning and community needed to grow.
        </p>
      </div>

      {/* Events List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
          Loading NLS classes...
        </div>
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
          No NLS classes scheduled yet. Check back soon! 📅
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
                👥 {event.attendees || 0} enrolled
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={detailRowStyle}>
                <span>📅</span>
                <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
              </div>
              <div style={detailRowStyle}>
                <span>📍</span>
                <span>{event.location}</span>
              </div>
              {event.description && (
                <div style={{ ...detailRowStyle, alignItems: 'start' }}>
                  <span>ℹ️</span>
                  <span>{event.description}</span>
                </div>
              )}
            </div>

            {registrations[event.id] ? (
              <button
                onClick={() => handleUnregister(event.id)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#f0f4f8',
                  color: 'var(--accent)',
                  border: '2px solid var(--accent)',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                Unregister
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
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                Register Now
              </button>
            )}
          </div>
        ))
      )}

      {showAddModal && (
        <AddNLSModal
          onClose={() => setShowAddModal(false)}
          onEventAdded={handleEventAdded}
          user={authUser}
        />
      )}
    </div>
  );
};

const infoCardStyle = {
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '24px'
};

const eventCardStyle = {
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '20px',
  marginBottom: '16px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  border: '1px solid #f0f0f0'
};

const detailRowStyle = {
  display: 'flex',
  gap: '8px',
  fontSize: '0.9rem',
  color: '#555'
};

export default NLSScreen;
