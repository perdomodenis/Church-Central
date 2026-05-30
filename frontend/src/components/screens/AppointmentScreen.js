import React, { useState } from 'react';

const STAFF_MEMBERS = [
  { name: 'James Peterson', role: 'Senior Pastor' },
  { name: 'Rachel Thompson', role: 'Worship Pastor' },
  { name: 'Juan Rivera', role: 'Youth Director' },
  { name: 'Sofia Garcia', role: 'Community Outreach Coordinator' },
  { name: 'Mark Anderson', role: 'Bible Study Leader' },
  { name: 'Patricia White', role: 'Prayer Coordinator' }
];

const RECENT_APPOINTMENTS = [
  {
    id: 1,
    staff: 'James Peterson',
    date: 'Jun 2, 2025',
    time: '3:00 PM',
    status: 'Confirmed',
    type: 'Pastoral Counseling',
    notes: 'Follow-up discussion'
  },
  {
    id: 2,
    staff: 'Rachel Thompson',
    date: 'Jun 5, 2025',
    time: '2:30 PM',
    status: 'Scheduled',
    type: 'Worship Discussion',
    notes: 'Summer worship planning'
  }
];

const AppointmentScreen = () => {
  const [booking, setBooking] = useState({
    staff: '',
    date: '',
    time: '',
    reason: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking appointment:', booking);
    alert('Your appointment request has been submitted for review.');
    setBooking({ staff: '', date: '', time: '', reason: '' });
  };

  return (
    <div className="appointment-screen" style={{ padding: '16px', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>Book an Appointment</h2>
        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Schedule a time with our leaders for guidance, prayer, or counseling.</p>
      </div>

      <form onSubmit={handleSubmit} style={formCardStyle}>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Select Leader</label>
          <select 
            value={booking.staff} 
            onChange={(e) => setBooking({...booking, staff: e.target.value})}
            style={inputStyle}
            required
          >
            <option value="">Choose a person...</option>
            {STAFF_MEMBERS.map(s => <option key={s.name} value={s.name}>{s.name} - {s.role}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Date</label>
            <input 
              type="date" 
              value={booking.date} 
              onChange={(e) => setBooking({...booking, date: e.target.value})}
              style={inputStyle} 
              required 
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Time</label>
            <input 
              type="time" 
              value={booking.time} 
              onChange={(e) => setBooking({...booking, time: e.target.value})}
              style={inputStyle} 
              required 
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Reason for Appointment</label>
          <textarea 
            value={booking.reason} 
            onChange={(e) => setBooking({...booking, reason: e.target.value})}
            placeholder="How can we help you?"
            style={{ ...inputStyle, height: '80px', resize: 'none', fontFamily: 'inherit' }}
          />
        </div>

        <button type="submit" style={submitButtonStyle}>Request Appointment</button>
      </form>

      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>Your Appointments</h3>
        {RECENT_APPOINTMENTS.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#999' }}>
            No appointments scheduled yet
          </div>
        ) : RECENT_APPOINTMENTS.map(app => (
          <div key={app.id} style={appointmentCardStyle}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', color: '#111' }}>{app.staff}</div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>{app.type}</div>
              <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>📅 {app.date} at {app.time}</div>
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              fontWeight: 'bold', 
              color: 'var(--accent)', 
              backgroundColor: 'rgba(91, 63, 187, 0.1)', 
              padding: '4px 10px', 
              borderRadius: '100px' 
            }}>
              {app.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const formCardStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  border: '1px solid #f0f0f0'
};

const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#444' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.95rem', boxSizing: 'border-box' };
const submitButtonStyle = { width: '100%', padding: '14px', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' };

const appointmentCardStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'white',
  padding: '16px',
  borderRadius: '12px',
  marginBottom: '12px',
  border: '1px solid #eee'
};

export default AppointmentScreen;