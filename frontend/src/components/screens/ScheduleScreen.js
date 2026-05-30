import React, { useState, useEffect } from 'react';
import { getAllEvents, deleteEvent } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';
import AddEventModal from './AddEventModal';
import { formatEventDate, formatEventTime } from '../../services/calendarService';

const ScheduleScreen = () => {
  const { user: authUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const allEvents = await getAllEvents();
    setEvents(allEvents);
    setLoading(false);
  };

  const handleAddEvent = (newEvent) => {
    setEvents(prev => [...prev, newEvent].sort((a, b) => new Date(a.startTime) - new Date(b.startTime)));
  };

  const handleDeleteEvent = async (eventId, createdBy) => {
    if (createdBy !== authUser?.uid) {
      alert('You can only delete your own events');
      return;
    }

    if (window.confirm('Delete this event?')) {
      try {
        await deleteEvent(eventId);
        setEvents(prev => prev.filter(e => e.id !== eventId));
      } catch (error) {
        alert('Error deleting event: ' + error.message);
      }
    }
  };

  return (
    <div className="schedule-screen" style={{ padding: '16px', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111' }}>Upcoming Events</h2>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            fontWeight: '600',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}>
          +
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
          No events yet. Click + to add one! 📅
        </div>
      ) : (
        events.map(event => {
          const dateInfo = formatEventDate(event.startTime);
          const timeInfo = formatEventTime(event.startTime, event.endTime);
          const canDelete = authUser?.uid === event.createdBy;

          return (
            <div key={event.id} style={cardStyle}>
              <div style={dateColumnStyle}>
                <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase' }}>
                  {dateInfo.day}
                </span>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', lineHeight: '1' }}>
                  {dateInfo.date}
                </span>
                <span style={{ fontSize: '0.6rem', color: '#666', fontWeight: '600' }}>
                  {dateInfo.month}
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#111' }}>{event.title}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#999' }}>by {event.createdByName}</span>
                  </div>
                  <span style={tagStyle}>{event.category}</span>
                </div>

                <div style={infoRowStyle}>
                  <span style={{ fontSize: '0.9rem' }}>🕒</span>
                  <span style={infoTextStyle}>{timeInfo}</span>
                </div>

                {event.location && (
                  <div style={infoRowStyle}>
                    <span style={{ fontSize: '0.9rem' }}>📍</span>
                    <span style={infoTextStyle}>{event.location}</span>
                  </div>
                )}

                {event.description && (
                  <div style={{ ...infoRowStyle, marginTop: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#555' }}>{event.description}</span>
                  </div>
                )}

                {canDelete && (
                  <button
                    onClick={() => handleDeleteEvent(event.id, event.createdBy)}
                    style={{
                      marginTop: '8px',
                      padding: '4px 8px',
                      backgroundColor: '#ffebee',
                      color: '#c62828',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}

      {showAddModal && (
        <AddEventModal
          onClose={() => setShowAddModal(false)}
          onEventAdded={handleAddEvent}
          user={authUser}
        />
      )}
    </div>
  );
};

const cardStyle = {
  display: 'flex',
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '16px',
  marginBottom: '16px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
  gap: '16px',
  border: '1px solid #f0f0f0'
};

const dateColumnStyle = {
  width: '50px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRight: '1px solid #eee',
  paddingRight: '16px'
};

const infoRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '4px'
};

const infoTextStyle = {
  fontSize: '0.85rem',
  color: '#666',
  fontWeight: '500'
};

const tagStyle = {
  fontSize: '0.65rem',
  fontWeight: '700',
  backgroundColor: '#f0f0f0',
  padding: '2px 8px',
  borderRadius: '100px',
  color: '#666',
  textTransform: 'uppercase'
};

export default ScheduleScreen;