import React, { useState } from 'react';
import { createNLSEvent } from '../../services/nlsService';

const AddNLSModal = ({ onClose, onEventAdded, user }) => {
  const [formData, setFormData] = useState({
    title: 'New Life School Class',
    date: '',
    time: '',
    location: 'Church Campus',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.date) {
      setError('Date is required');
      setLoading(false);
      return;
    }

    if (!formData.time) {
      setError('Time is required');
      setLoading(false);
      return;
    }

    try {
      const newEvent = await createNLSEvent(formData, user.uid, user.displayName || 'Church');
      onEventAdded(newEvent);
      onClose();
    } catch (err) {
      setError('Error creating class: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0, color: '#111' }}>Create NLS Class</h2>
          <button onClick={onClose} style={closeButtonStyle}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Class Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., NLS Level 1"
              style={inputStyle}
            />
          </div>

          <div style={rowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Time *</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Church Campus"
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional details..."
              style={{...inputStyle, minHeight: '80px', fontFamily: 'inherit'}}
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
              Cancel
            </button>
            <button type="submit" disabled={loading} style={submitButtonStyle(loading)}>
              {loading ? 'Creating...' : 'Create Class'}
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

export default AddNLSModal;
