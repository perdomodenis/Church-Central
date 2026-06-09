import React, { useState, useEffect } from 'react';
import { addEvent, getAllEvents, deleteEvent } from '../../services/eventService';
import { useLanguage } from '../../context/LanguageContext';

const EventsScreen = ({ user }) => {
  const { t, language } = useLanguage();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'General'
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const eventsList = await getAllEvents();
      setEvents(eventsList);
    } catch (error) {
      console.error('Error loading events:', error);
    }
    setLoading(false);
  };

  const handleCreateEvent = async () => {
    if (!formData.title || !formData.date || !formData.location || !user?.uid) return;

    setCreating(true);
    try {
      await addEvent({
        ...formData,
        createdByName: `${user.first} ${user.last}`
      }, user.uid);

      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'General'
      });
      setShowForm(false);
      await loadEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
    setCreating(false);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      await loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const categories = ['General', 'Worship', 'Study', 'Social', 'Outreach', 'Youth', 'Other'];

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Sticky Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'white',
        padding: '24px',
        borderBottom: '1px solid #eee'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📅</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 4px 0', color: '#111' }}>
            {t('communityEvents')}
          </h2>
          <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>
            {t('createDiscoverEvents')}
          </p>
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>
        {/* Create Event Button/Form */}
        <div style={{
          ...cardStyle,
          backgroundColor: 'rgba(91, 63, 187, 0.03)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ ...sectionTitleStyle, margin: 0 }}>{t('createEvent')}</h3>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--accent)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1.2rem'
              }}
            >
              {showForm ? '✕' : '+'}
            </button>
          </div>

          {showForm && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                name="title"
                placeholder={t('eventTitle') + '*'}
                value={formData.title}
                onChange={handleInputChange}
                style={inputStyle}
              />

              <textarea
                name="description"
                placeholder={t('descriptionOptional')}
                value={formData.description}
                onChange={handleInputChange}
                style={{...inputStyle, minHeight: '60px', resize: 'vertical'}}
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={inputStyle}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{t(cat.toLowerCase())}</option>
                ))}
              </select>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>

              <input
                type="text"
                name="location"
                placeholder={t('locationPlaceholder')}
                value={formData.location}
                onChange={handleInputChange}
                style={inputStyle}
              />

              <button
                onClick={handleCreateEvent}
                disabled={creating || !formData.title || !formData.date || !formData.location}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: creating || !formData.title || !formData.date || !formData.location ? '#ccc' : 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: creating || !formData.title || !formData.date || !formData.location ? 'not-allowed' : 'pointer'
                }}
              >
                {creating ? t('creating') : t('createEvent')}
              </button>
            </div>
          )}
        </div>

        {/* Events List */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111', margin: '0 0 16px 0' }}>
            {t('upcomingEvents')} ({events.length})
          </h3>

          {loading ? (
            <p style={{ color: '#999' }}>{t('loadingEvents')}</p>
          ) : events.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#999'
            }}>
              <p style={{ fontSize: '2rem', marginBottom: '8px' }}>📭</p>
              <p>{t('noEventsYet')}</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} style={cardStyle}>
                {/* Header with category badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{ margin: 0, color: '#111', fontSize: '1.1rem', fontWeight: '700' }}>
                        {event.title}
                      </h3>
                      <span style={{
                        backgroundColor: 'rgba(91, 63, 187, 0.1)',
                        color: 'var(--accent)',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {t(event.category.toLowerCase())}
                      </span>
                    </div>
                    <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>
                      {t('by')} {event.createdBy}
                    </p>
                  </div>
                  {event.userId === user?.uid && (
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#d32f2f',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Description */}
                {event.description && (
                  <p style={{
                    color: '#555',
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                    margin: '0 0 12px 0'
                  }}>
                    {event.description}
                  </p>
                )}

                {/* Event Details */}
                <div style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1rem' }}>📅</span>
                    <span style={{ color: '#333', fontSize: '0.9rem' }}>
                      {new Date(event.date).toLocaleDateString(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : language === 'de' ? 'de-DE' : language, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {event.time && (
                      <>
                        <span style={{ color: '#999' }}>•</span>
                        <span style={{ color: '#333', fontSize: '0.9rem' }}>{event.time}</span>
                      </>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1rem' }}>📍</span>
                    <span style={{ color: '#333', fontSize: '0.9rem' }}>{event.location}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  {t('attendEvent')}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '20px',
  marginBottom: '20px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  border: '1px solid #f0f0f0'
};

const sectionTitleStyle = {
  fontSize: '1.1rem',
  fontWeight: '700',
  color: '#111',
  margin: '0 0 16px 0'
};

const inputStyle = {
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  boxSizing: 'border-box'
};

export default EventsScreen;
