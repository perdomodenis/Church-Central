import React, { useState, useEffect } from 'react';
import { getAllEvents, deleteEvent } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';
import AddEventModal from './AddEventModal';
import { formatEventDate, formatEventTime } from '../../services/calendarService';
import { useLanguage } from '../../context/LanguageContext';

const isValidEvent = (event) => {
  return event.title && event.title !== 'TBD' && event.startTime && event.startTime !== 'TBD';
};

// Static church service program (does not depend on component state)
const SERVICE_PROGRAM = [
  { id: 1, time: '10:00 AM', title: 'Welcome & Announcements', leader: 'Pastor John' },
  { id: 2, time: '10:15 AM', title: 'Praise & Worship', leader: 'Worship Team' },
  { id: 3, time: '10:45 AM', title: 'Tithes & Offerings', leader: 'Deacon Smith' },
  { id: 4, time: '10:55 AM', title: 'Special Music', leader: 'Youth Choir' },
  { id: 5, time: '11:00 AM', title: 'Sermon', leader: 'Pastor Sarah' },
  { id: 6, time: '11:45 AM', title: 'Altar Call & Prayer', leader: 'Prayer Ministry' },
  { id: 7, time: '12:00 PM', title: 'Closing & Benediction', leader: 'Pastor John' }
];

// Static department attendance roster
const DEPARTMENT_MEMBERS = [
  { id: 1, name: 'Alice Johnson', role: 'Team Lead', present: true },
  { id: 2, name: 'Bob Smith', role: 'Member', present: false },
  { id: 3, name: 'Charlie Davis', role: 'Member', present: true },
  { id: 4, name: 'Diana Evans', role: 'Coordinator', present: true },
  { id: 5, name: 'Evan Harris', role: 'Member', present: false },
];

const getMinutesSinceMidnight = (timeStr) => {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const ScheduleScreen = ({ user: userProp, openAddEventOnMount, onCloseAddEventOnMount }) => {
  const { t } = useLanguage();
  const { user: authUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('me'); // 'me', 'church', 'department'

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (openAddEventOnMount) {
      setShowAddModal(true);
      if (onCloseAddEventOnMount) onCloseAddEventOnMount();
    }
  }, [openAddEventOnMount]);

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
      alert(t('onlyDeleteOwnEvents'));
      return;
    }

    if (window.confirm(t('deleteEventConfirm'))) {
      try {
        await deleteEvent(eventId);
        setEvents(prev => prev.filter(e => e.id !== eventId));
      } catch (error) {
        alert(t('errorDeletingEvent') + error.message);
      }
    }
  };

  // Resolve ongoing program item using time checks
  const getOngoingItemId = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    // Real-time check
    for (let i = 0; i < SERVICE_PROGRAM.length; i++) {
      const item = SERVICE_PROGRAM[i];
      const nextItem = SERVICE_PROGRAM[i + 1];
      const start = getMinutesSinceMidnight(item.time);
      const end = nextItem ? getMinutesSinceMidnight(nextItem.time) : getMinutesSinceMidnight('12:15 PM');
      if (currentMinutes >= start && currentMinutes < end) {
        return item.id;
      }
    }
    return null;
  };

  const ongoingId = getOngoingItemId();
  const isServiceOffline = ongoingId === null;

  const validEvents = events.filter(isValidEvent);
  const personalEvents = validEvents.filter(e => e.type !== 'Work Shift');
  const workShifts = validEvents.filter(e => e.type === 'Work Shift');
  const totalHours = workShifts.reduce((acc, curr) => acc + (parseFloat(curr.hours) || 0), 0);

  const renderTabContent = () => {
    if (activeTab === 'church') {
      return (
        <div style={{ marginTop: '16px' }}>
          {isServiceOffline && (
            <div style={{
              backgroundColor: '#fff8e1',
              color: '#b78103',
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '16px',
              border: '1px solid #ffe082',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>ℹ️</span>
              <span>Sunday Service is currently offline (Schedules run Sundays 10:00 AM – 12:15 PM). No item is currently ongoing.</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, color: '#111' }}>{t('upcomingServiceProgram')}</h3>
            <button
              onClick={() => alert(t('testimonySentAlert'))}
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
              {t('submitTestimony')}
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {SERVICE_PROGRAM.map((item) => {
              const isOngoing = item.id === ongoingId;
              return (
                <div 
                  key={item.id} 
                  style={{ 
                    ...cardStyle, 
                    padding: '12px 16px', 
                    gap: '12px',
                    border: isOngoing ? '2px solid #4caf50' : '1px solid #f0f0f0',
                    backgroundColor: isOngoing ? '#f9fdfa' : 'white',
                    position: 'relative'
                  }}
                >
                  <div style={{ fontWeight: '700', color: isOngoing ? '#2e7d32' : 'var(--accent)', minWidth: '80px' }}>{item.time}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#111' }}>{item.title}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.leader}</div>
                  </div>
                  {isOngoing && (
                    <span style={{
                      backgroundColor: '#e8f5e9',
                      color: '#2e7d32',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 6px rgba(46, 125, 50, 0.1)',
                      alignSelf: 'center'
                    }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#2e7d32',
                        display: 'inline-block'
                      }} />
                      Currently Ongoing
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (activeTab === 'department') {
      return (
        <div style={{ marginTop: '16px' }}>
          <h3 style={{ marginBottom: '16px', color: '#111' }}>{t('departmentMembers')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {DEPARTMENT_MEMBERS.map(member => (
              <div key={member.id} style={{ ...cardStyle, padding: '12px 16px', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: member.present ? '#4caf50' : '#f44336'
                }} title={member.present ? t('present') : t('absent')} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#111' }}>{member.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{member.role}</div>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: member.present ? '#4caf50' : '#f44336' }}>
                  {member.present ? t('present') : t('absent')}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default: 'me' tab
    const canAddSchedule = (userProp?.accessLevel || 1) >= 3;
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#111' }}>{t('mySchedule')}</h3>
            {totalHours > 0 && (
              <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>
                {t('totalHoursLogged')}<strong style={{ color: 'var(--accent)' }}>{totalHours}h</strong>
              </span>
            )}
          </div>
          {canAddSchedule && (
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
              + {t('add')}
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
            {t('loadingEvents')}
          </div>
        ) : validEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
            {t('noEvents')} 📅
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {workShifts.length > 0 && (
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Obligatory Attendance</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {workShifts.map(event => renderEventCard(event))}
                </div>
              </div>
            )}

            {personalEvents.length > 0 && (
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: '#666', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Group Meetings</h4>
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
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase' }}>
              {dateInfo.day}
            </span>
          )}
          {dateInfo.date && dateInfo.date !== 'TBD' && (
            <span style={{ fontSize: '1.4rem', fontWeight: '800', lineHeight: '1' }}>
              {dateInfo.date}
            </span>
          )}
          {dateInfo.month && dateInfo.month !== 'TBD' && (
            <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: '600' }}>
              {dateInfo.month}
            </span>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', color: '#111' }}>{event.title}</h3>
              {event.createdByName && event.createdByName !== 'TBD' && (
                <span style={{ fontSize: '0.75rem', color: '#999' }}>{t('by')} {event.createdByName}</span>
              )}
            </div>
            {shouldShow.category && <span style={tagStyle}>{t(event.category.toLowerCase())}</span>}
          </div>

          {/* Formatted Event Type Indicators */}
          {event.type === 'Work Shift' ? (
            <div style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '700', margin: '6px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>⚠️</span>
              <span>Obligatory attendance on {dateInfo.date} {dateInfo.month} at {timeInfo}</span>
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '700', margin: '6px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>👥</span>
              <span>Group meeting at {timeInfo} on {dateInfo.date} {dateInfo.month}</span>
            </div>
          )}

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
              <span style={infoTextStyle}>{t('dressCode')}: <strong style={{ color: 'var(--accent)' }}>{event.dressCode}</strong></span>
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
                  <span style={{ fontSize: '1rem' }}>▶</span> {t('watchStream')}
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
                  <span style={{ fontSize: '1rem' }}>📹</span> {t('joinMeeting')}
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
              {t('delete')}
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
              transition: 'all 0.2s'
            }}
          >
            {t(tab)}
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