import React, { useState, useEffect } from 'react';
import { getCalendarEvents, formatEventDate, formatEventTime, getCalendarUrl } from '../../services/calendarService';

const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Sunday Morning Service',
    startTime: '2024-10-22T10:00:00',
    endTime: '2024-10-22T12:00:00',
    location: 'Main Sanctuary',
    category: 'Worship'
  },
  {
    id: 2,
    title: 'Mid-week Bible Study',
    startTime: '2024-10-25T19:00:00',
    endTime: '2024-10-25T20:30:00',
    location: 'Room 302',
    category: 'Study'
  },
  {
    id: 3,
    title: 'Youth Night',
    startTime: '2024-10-27T18:30:00',
    endTime: '2024-10-27T21:00:00',
    location: 'Gymnasium',
    category: 'Youth'
  },
  {
    id: 4,
    title: 'Community Outreach',
    startTime: '2024-10-28T09:00:00',
    endTime: '2024-10-28T13:00:00',
    location: 'Downtown Center',
    category: 'Community'
  }
];

const ScheduleScreen = () => {
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [loading, setLoading] = useState(true);
  const [hasApiConfigured, setHasApiConfigured] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const calendarEvents = await getCalendarEvents();

      if (calendarEvents) {
        setHasApiConfigured(true);
        setEvents(calendarEvents);
      } else {
        setHasApiConfigured(false);
        setEvents(MOCK_EVENTS);
      }

      setLoading(false);
    };

    fetchEvents();
  }, []);

  const handleViewCalendar = () => {
    const url = getCalendarUrl();
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="schedule-screen" style={{ padding: '16px', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111' }}>Upcoming Events</h2>
        <button
          onClick={handleViewCalendar}
          style={{
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

      {!hasApiConfigured && !loading && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          fontSize: '0.85rem',
          color: '#856404'
        }}>
          📅 To display real church events, configure Google Calendar in your environment settings.
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
          No upcoming events
        </div>
      ) : (
        events.map(event => {
          const dateInfo = formatEventDate(event.startTime);
          const timeInfo = formatEventTime(event.startTime, event.endTime);

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
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#111' }}>{event.title}</h3>
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
              </div>
            </div>
          );
        })
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