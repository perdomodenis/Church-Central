import React, { useState } from 'react';
import { addEvent, extractCategory } from '../../services/eventService';
import { useLanguage } from '../../context/LanguageContext';

const AddEventModal = ({ onClose, onEventAdded, user }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    category: 'Event',
    streamUrl: '',
    videoConferenceUrl: '',
    type: 'Personal',
    hours: '',
    dressCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'title') {
      setFormData(prev => ({
        ...prev,
        category: extractCategory(value)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.title.trim()) {
      setError(t('titleRequired'));
      setLoading(false);
      return;
    }

    if (!formData.startTime) {
      setError(t('startRequired'));
      setLoading(false);
      return;
    }

    if (!formData.endTime) {
      setError(t('endRequired'));
      setLoading(false);
      return;
    }

    try {
      const newEvent = await addEvent({
        ...formData,
        category: extractCategory(formData.title)
      }, user.uid);

      onEventAdded(newEvent);
      onClose();
    } catch (err) {
      setError(t('errorAddingEvent') + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, color: '#111' }}>{t('addEvent')}</h2>
          <button onClick={onClose} style={closeButtonStyle}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600' }}>
              <input
                type="radio"
                name="type"
                value="Personal"
                checked={formData.type === 'Personal'}
                onChange={handleChange}
                style={{ accentColor: 'var(--accent)' }}
              />
              {t('personalEvent')}
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600' }}>
              <input
                type="radio"
                name="type"
                value="Work Shift"
                checked={formData.type === 'Work Shift'}
                onChange={handleChange}
                style={{ accentColor: 'var(--accent)' }}
              />
              {t('workShift')}
            </label>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>{t('eventTitle')} *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={t('eventTitlePlaceholder')}
              style={inputStyle}
            />
          </div>

          <div style={rowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>{t('startDate')}</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>{t('endDate')}</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          {formData.type === 'Work Shift' && (
            <div style={formGroupStyle}>
              <label style={labelStyle}>{t('hoursLogged')}</label>
              <input
                type="number"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                placeholder="e.g., 4.5"
                step="0.5"
                min="0"
                style={inputStyle}
              />
            </div>
          )}

          <div style={formGroupStyle}>
            <label style={labelStyle}>{t('location')}</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder={t('locationPlaceholder')}
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>{t('description')}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t('descriptionPlaceholder')}
              style={{...inputStyle, minHeight: '80px', fontFamily: 'inherit'}}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>{t('category')}</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Worship">{t('worship')}</option>
              <option value="Youth">{t('youth')}</option>
              <option value="Study">{t('study')}</option>
              <option value="Outreach">{t('outreach')}</option>
              <option value="Baptism">{t('baptism')}</option>
              <option value="Event">{t('event')}</option>
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>{t('dressCodeOptional')}</label>
            <input
              type="text"
              name="dressCode"
              value={formData.dressCode}
              onChange={handleChange}
              placeholder={t('dressCodePlaceholder')}
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>{t('liveStreamOptional')}</label>
            <input
              type="url"
              name="streamUrl"
              value={formData.streamUrl}
              onChange={handleChange}
              placeholder="e.g., https://youtube.com/..."
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>{t('videoConferenceOptional')}</label>
            <input
              type="url"
              name="videoConferenceUrl"
              value={formData.videoConferenceUrl}
              onChange={handleChange}
              placeholder="e.g., https://zoom.us/j/..."
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <div style={buttonGroupStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              {t('cancel')}
            </button>
            <button type="submit" disabled={loading} style={submitButtonStyle(loading)}>
              {loading ? t('creating') : t('addEvent')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'flex-end',
  zIndex: 3000
};

const modalStyle = {
  backgroundColor: 'white',
  width: '100%',
  borderTopLeftRadius: '20px',
  borderTopRightRadius: '20px',
  padding: '20px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 -4px 12px rgba(0,0,0,0.1)'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  paddingBottom: '12px',
  borderBottom: '1px solid #eee'
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  color: '#999'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const formGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const labelStyle = {
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#333'
};

const inputStyle = {
  padding: '10px 12px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  fontSize: '0.95rem',
  fontFamily: 'inherit'
};

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px'
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '12px',
  marginTop: '16px'
};

const cancelButtonStyle = {
  flex: 1,
  padding: '12px',
  backgroundColor: '#f0f0f0',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  cursor: 'pointer',
  fontSize: '0.95rem'
};

const submitButtonStyle = (disabled) => ({
  flex: 1,
  padding: '12px',
  backgroundColor: disabled ? '#ccc' : 'var(--accent)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: '0.95rem'
});

export default AddEventModal;
