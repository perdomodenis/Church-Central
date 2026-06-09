import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const AppointmentScreen = () => {
  const { t } = useLanguage();

  const staffMembers = [
    { name: 'James Peterson', role: t('seniorPastor') },
    { name: 'Rachel Thompson', role: t('worshipPastor') },
    { name: 'Juan Rivera', role: t('youthDirector') },
    { name: 'Sofia Garcia', role: t('outreachCoordinator') },
    { name: 'Mark Anderson', role: t('bibleStudyLeader') },
    { name: 'Patricia White', role: t('prayerCoordinator') }
  ];

  const recentAppointments = [
    {
      id: 1,
      staff: 'James Peterson',
      date: 'Jun 2, 2025',
      time: '3:00 PM',
      status: t('confirmed'),
      type: t('pastoralCounseling'),
      notes: 'Follow-up discussion'
    },
    {
      id: 2,
      staff: 'Rachel Thompson',
      date: 'Jun 5, 2025',
      time: '2:30 PM',
      status: t('scheduled'),
      type: t('worshipDiscussion'),
      notes: 'Summer worship planning'
    }
  ];

  const [booking, setBooking] = useState({
    staff: '',
    date: '',
    time: '',
    reason: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking appointment:', booking);
    alert(t('appointmentRequestSubmitted'));
    setBooking({ staff: '', date: '', time: '', reason: '' });
  };

  return (
    <div className="appointment-screen" style={{ padding: '16px', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>{t('bookAppointment')}</h2>
        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{t('scheduleLeaderGuidance')}</p>
      </div>

      <form onSubmit={handleSubmit} style={formCardStyle}>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>{t('selectLeader')}</label>
          <select 
            value={booking.staff} 
            onChange={(e) => setBooking({...booking, staff: e.target.value})}
            style={inputStyle}
            required
          >
            <option value="">{t('choosePerson')}</option>
            {staffMembers.map(s => <option key={s.name} value={s.name}>{s.name} - {s.role}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>{t('date')}</label>
            <input 
              type="date" 
              value={booking.date} 
              onChange={(e) => setBooking({...booking, date: e.target.value})}
              style={inputStyle} 
              required 
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>{t('time')}</label>
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
          <label style={labelStyle}>{t('reasonAppointment')}</label>
          <textarea 
            value={booking.reason} 
            onChange={(e) => setBooking({...booking, reason: e.target.value})}
            placeholder={t('howCanWeHelp')}
            style={{ ...inputStyle, height: '80px', resize: 'none', fontFamily: 'inherit' }}
          />
        </div>

        <button type="submit" style={submitButtonStyle}>{t('requestAppointment')}</button>
      </form>

      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>{t('yourAppointments')}</h3>
        {recentAppointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#999' }}>
            {t('noAppointmentsYet')}
          </div>
        ) : recentAppointments.map(app => (
          <div key={app.id} style={appointmentCardStyle}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', color: '#111' }}>{app.staff}</div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>{app.type}</div>
              <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>📅 {app.date} {t('at')} {app.time}</div>
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