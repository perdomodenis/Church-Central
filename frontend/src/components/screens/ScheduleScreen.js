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
  const [activeTab, setActiveTab] = useState('me'); // 'me', 'church', 'department'

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

  const isValidEvent = (event) => {
    return event.title && event.title !== 'TBD' && event.startTime && event.startTime !== 'TBD';
  };

  const validEvents = events.filter(isValidEvent);
  const personalEvents = validEvents.filter(e => e.type !== 'Work Shift');
  const workShifts = validEvents.filter(e => e.type === 'Work Shift');
  const totalHours = workShifts.reduce((acc, curr) => acc + (parseFloat(curr.hours) || 0), 0);

  // Mock data for Church Tab
  const serviceProgram = [
    { time: '10:00 AM', title: 'Welcome & Announcements', leader: 'Pastor John' },
    { time: '10:15 AM', title: 'Praise & Worship', leader: 'Worship Team' },
    { time: '10:45 AM', title: 'Tithes & Offerings', leader: 'Deacon Smith' },
    { time: '10:55 AM', title: 'Special Music', leader: 'Youth Choir' },
    { time: '11:00 AM', title: 'Sermon', leader: 'Pastor Sarah' },
    { time: '11:45 AM', title: 'Altar Call & Prayer', leader: 'Prayer Ministry' },
    { time: '12:00 PM', title: 'Closing & Benediction', leader: 'Pastor John' }
  ];

  // Mock data for Department Tab
  const departmentMembers = [
    { id: 1, name: 'Alice Johnson', role: 'Team Lead', present: true },
    { id: 2, name: 'Bob Smith', role: 'Member', present: false },
    { id: 3, name: 'Charlie Davis', role: 'Member', present: true },
    { id: 4, name: 'Diana Evans', role: 'Coordinator', present: true },
    { id: 5, name: 'Evan Harris', role: 'Member', present: false },
  ];

  const renderTabContent = () => {
    if (activeTab === 'church') {
      return (
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, color: '#111' }}>Upcoming Service Program</h3>
            <button
              onClick={() => alert('Testimony request sent to admin!')}
              style={{
                backgroundColor: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Submit Testimony
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {serviceProgram.map((item, index) => (
              <div key={index} style={{ ...cardStyle, padding: '12px 16px', gap: '12px' }}>
                <div style={{ fontWeight: '700', color: 'var(--accent)', minWidth: '80px' }}>{item.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#111' }}>{item.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.leader}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'department') {
      return (
        <div style={{ marginTop: '16px' }}>
          <h3 style={{ marginBottom: '16px', color: '#111' }}>Department Members</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {departmentMembers.map(member => (
              <div key={member.id} style={{ ...cardStyle, padding: '12px 16px', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: member.present ? '#4caf50' : '#f44336'
                }} title={member.present ? 'Present' : 'Absent'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#111' }}>{member.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{member.role}</div>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: member.present ? '#4caf50' : '#f44336' }}>
                  {member.present ? 'Present' : 'Absent'}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default: 'me' tab
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#111' }}>My Schedule</h3>
            {totalHours > 0 && (
              <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>
                Total Hours Logged: <strong style={{ color: 'var(--accent)' }}>{totalHours}h</strong>
              </span>
            )}
          </div>
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
            + Add
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
            Loading events...
          </div>
        ) : validEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
            No events yet. Click + to add one! 📅
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {workShifts.length > 0 && (
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Work Shifts</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {workShifts.map(event => renderEventCard(event))}
                </div>
              </div>
            )}
            
            {personalEvents.length > 0 && (
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Personal Events</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {personalEvents.map(event => renderEventCard(event))}
                </div>
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  const renderEventCard = (event) => {
    const dateInfo = formatEventDate(event.startTime);
    const timeInfo = formatEventTime(event.startTime, event.endTime);
    const canDelete = authUser?.uid === event.createdBy;

    const shouldShow = {
      time: timeInfo && timeInfo !== 'TBD' && !timeInfo.includes('Invalid'),
      location: event.location && event.location !== 'TBD',
      description: event.description && event.description !== 'TBD',
      category: event.category && event.category !== 'TBD'
    };

    return (
      <div key={event.id} style={cardStyle}>
                <div style={dateColumnStyle}>
                  {dateInfo.day && dateInfo.day !== 'TBD' && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase' }}>
                      {dateInfo.day}
                    </span>
                  )}
                  {dateInfo.date && dateInfo.date !== 'TBD' && (
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', lineHeight: '1' }}>
                      {dateInfo.date}
                    </span>
                  )}
                  {dateInfo.month && dateInfo.month !== 'TBD' && (
                    <span style={{ fontSize: '0.6rem', color: '#666', fontWeight: '600' }}>
                      {dateInfo.month}
                    </span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#111' }}>{event.title}</h3>
                      {event.createdByName && event.createdByName !== 'TBD' && (
                        <span style={{ fontSize: '0.75rem', color: '#999' }}>by {event.createdByName}</span>
                      )}
                    </div>
                    {shouldShow.category && <span style={tagStyle}>{event.category}</span>}
                  </div>

                  {shouldShow.time && (
                    <div style={infoRowStyle}>
                      <span style={{ fontSize: '0.9rem' }}>🕒</span>
                      <span style={infoTextStyle}>{timeInfo}</span>
                    </div>
                  )}

                  {shouldShow.location && (
                    <div style={infoRowStyle}>
                      <span style={{ fontSize: '0.9rem' }}>📍</span>
                      <span style={infoTextStyle}>{event.location}</span>
                    </div>
                  )}

                  {event.dressCode && (
                    <div style={infoRowStyle}>
                      <span style={{ fontSize: '0.9rem' }}>👔</span>
                      <span style={infoTextStyle}>Dress Code: <strong style={{ color: 'var(--accent)' }}>{event.dressCode}</strong></span>
                    </div>
                  )}

                  {shouldShow.description && (
                    <div style={{ ...infoRowStyle, marginTop: '8px' }}>
                      <span style={{ fontSize: '0.85rem', color: '#555' }}>{event.description}</span>
                    </div>
                  )}

                  {/* Event Links */}
                  {(event.streamUrl || event.videoConferenceUrl) && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                      {event.streamUrl && (
                        <a 
                          href={event.streamUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: '#fff0f0',
                            color: '#e53935',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            textDecoration: 'none',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span style={{ fontSize: '1rem' }}>▶</span> Watch Stream
                        </a>
                      )}
                      {event.videoConferenceUrl && (
                        <a 
                          href={event.videoConferenceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: '#e3f2fd',
                            color: '#1e88e5',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            textDecoration: 'none',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span style={{ fontSize: '1rem' }}>📹</span> Join Meeting
                        </a>
                      )}
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
  };

  return (
    <div className="schedule-screen" style={{ padding: '16px', paddingBottom: '80px' }}>
      
      {/* Tab Navigation */}
      <div style={{ display: 'flex', backgroundColor: '#f0f4f8', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
        {['me', 'church', 'department'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: activeTab === tab ? 'white' : 'transparent',
              color: activeTab === tab ? 'var(--accent)' : '#666',
              fontWeight: activeTab === tab ? '700' : '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderTabContent()}

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