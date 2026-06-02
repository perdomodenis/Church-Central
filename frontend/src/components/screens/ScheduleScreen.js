import React from 'react';

const MOCK_EVENTS = [
  {
    id: 1,
    date: 'OCT 22',
    day: 'SUN',
    title: 'Sunday Morning Service',
    time: '10:00 AM - 12:00 PM',
    location: 'Main Sanctuary',
    category: 'Service'
  },
  {
    id: 2,
    date: 'OCT 25',
    day: 'WED',
    title: 'Mid-week Bible Study',
    time: '7:00 PM - 8:30 PM',
    location: 'Room 302',
    category: 'Bible Study'
  },
  {
    id: 3,
    date: 'OCT 27',
    day: 'FRI',
    title: 'Youth Night',
    time: '6:30 PM - 9:00 PM',
    location: 'Gymnasium',
    category: 'Youth'
  },
  {
    id: 4,
    date: 'OCT 28',
    day: 'SAT',
    title: 'Community Outreach',
    time: '9:00 AM - 1:00 PM',
    location: 'Downtown Center',
    category: 'Mission'
  }
];

const ScheduleScreen = () => {
  return (
    <div className="schedule-screen" style={{ padding: '16px', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111' }}>Upcoming Events</h2>
        <button style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--accent)', 
          fontWeight: '600', 
          fontSize: '0.9rem',
          cursor: 'pointer'
        }}>
          View Calendar
        </button>
      </div>

      {MOCK_EVENTS.map(event => (
        <div key={event.id} style={cardStyle}>
          <div style={dateColumnStyle}>
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase' }}>
              {event.day}
            </span>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', lineHeight: '1' }}>
              {event.date.split(' ')[1]}
            </span>
            <span style={{ fontSize: '0.6rem', color: '#666', fontWeight: '600' }}>
              {event.date.split(' ')[0]}
            </span>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#111' }}>{event.title}</h3>
              <span style={tagStyle}>{event.category}</span>
            </div>
            
            <div style={infoRowStyle}>
              <span style={{ fontSize: '0.9rem' }}>🕒</span>
              <span style={infoTextStyle}>{event.time}</span>
            </div>
            
            <div style={infoRowStyle}>
              <span style={{ fontSize: '0.9rem' }}>📍</span>
              <span style={infoTextStyle}>{event.location}</span>
            </div>
          </div>
        </div>
      ))}
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