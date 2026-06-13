import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getAllMembers } from '../../services/memberService';
import { createAppointmentRequest, getPendingAppointments, getApprovedAppointments, getRejectedAppointments } from '../../services/appointmentService';
import { getAccessLevel } from '../../services/churchConstants';
import { sendInboxNotification } from '../../services/notificationService';

const AppointmentScreen = ({ user }) => {
  const { t } = useLanguage();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myAppointments, setMyAppointments] = useState([]);
  
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [slots, setSlots] = useState([
    { id: 'slot-1', date: '', time: '' },
    { id: 'slot-2', date: '', time: '' },
    { id: 'slot-3', date: '', time: '' }
  ]);
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadLeaders();
    loadMyAppointments();
  }, [user?.email]);

  const loadLeaders = async () => {
    try {
      const allMembers = await getAllMembers();
      // Filter members with role level >= 3 (Pastor, Leader, Deacon, etc.)
      const leadersList = allMembers.filter(m => getAccessLevel(m.position || '') >= 3);
      setLeaders(leadersList);
    } catch (error) {
      console.error('Error loading leaders:', error);
    }
  };

  const loadMyAppointments = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const [pending, approved, rejected] = await Promise.all([
        getPendingAppointments(),
        getApprovedAppointments(),
        getRejectedAppointments()
      ]);
      const merged = [
        ...pending.map(a => ({ ...a, status: 'pending' })),
        ...approved.map(a => ({ ...a, status: 'approved' })),
        ...rejected.map(a => ({ ...a, status: 'rejected' }))
      ];
      // Filter to appointments requested by this user
      const filtered = merged.filter(a => a.requesterEmail === user.email);
      setMyAppointments(filtered);
    } catch (error) {
      console.error('Error loading my appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotChange = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index][field] = value;
    setSlots(newSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLeader) {
      alert(t('error') + ': Please select a leader');
      return;
    }

    // Validate that all slots are filled out
    const isComplete = slots.every(s => s.date && s.time);
    if (!isComplete) {
      alert(t('error') + ': Please suggest all 3 slots');
      return;
    }

    try {
      const requesterName = user ? `${user.first} ${user.last}` : 'Guest';
      const requesterEmail = user ? user.email : 'guest@churchcentral.org';
      
      // Send the request. Set paUid to leader's PA if they have one.
      const paUid = selectedLeader.pa?.uid || null;

      const appointmentId = await createAppointmentRequest(
        requesterName,
        requesterEmail,
        `${selectedLeader.first} ${selectedLeader.last}`,
        selectedLeader.uid,
        paUid,
        slots,
        reason
      );

      // Send inbox notification to PA or Leader
      const targetUid = paUid || selectedLeader.uid;
      const recipientName = paUid ? 'PA of ' + selectedLeader.first : selectedLeader.first;
      await sendInboxNotification(targetUid, {
        sender: requesterName,
        senderId: user ? user.uid : 'guest',
        subject: 'New Appointment Request',
        preview: `${requesterName} requested an appointment: "${reason.substring(0, 40)}${reason.length > 40 ? '...' : ''}"`,
        body: `Hi ${recipientName}!\n\n${requesterName} has requested an appointment with ${selectedLeader.first} ${selectedLeader.last}.\n\nReason: "${reason}"\n\nSuggested slots:\n- Option 1: ${slots[0].date} at ${slots[0].time}\n- Option 2: ${slots[1].date} at ${slots[1].time}\n- Option 3: ${slots[2].date} at ${slots[2].time}\n\nPlease review and approve/reject this request.`,
        isAppointmentRequest: true,
        appointmentId,
        requesterEmail,
        date1: slots[0].date,
        time1: slots[0].time,
        date2: slots[1].date,
        time2: slots[1].time,
        date3: slots[2].date,
        time3: slots[2].time
      });

      alert(t('appointmentRequestSubmitted'));
      
      // Reset form
      setSelectedLeader(null);
      setSlots([
        { date: '', time: '' },
        { date: '', time: '' },
        { date: '', time: '' }
      ]);
      setReason('');
      
      // Reload list
      loadMyAppointments();
    } catch (error) {
      alert('Error booking appointment: ' + error.message);
    }
  };

  return (
    <div className="appointment-screen" style={{ padding: '16px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>{t('bookAppointment')}</h2>
        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{t('scheduleLeaderGuidance') || 'Schedule a meeting with a leader'}</p>
      </div>

      <form onSubmit={handleSubmit} style={formCardStyle}>
        {/* Visual Leader Selection Gallery */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ ...labelStyle, marginBottom: '12px' }}>{t('selectLeaderGallery')}</label>
          {leaders.length === 0 ? (
            <div style={{ fontSize: '0.9rem', color: '#999', fontStyle: 'italic' }}>Loading leaders...</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '12px',
              maxHeight: '280px',
              overflowY: 'auto',
              padding: '4px',
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              backgroundColor: '#fafafa'
            }}>
              {leaders.map(l => {
                const isSelected = selectedLeader?.uid === l.uid;
                const name = `${l.first} ${l.last}`;
                const initials = `${l.first?.[0] || ''}${l.last?.[0] || ''}`.toUpperCase();
                return (
                  <div 
                    key={l.uid} 
                    onClick={() => setSelectedLeader(l)}
                    style={leaderCardStyle(isSelected)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.04)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = isSelected ? 'scale(1.02)' : 'scale(1)';
                      e.currentTarget.style.boxShadow = isSelected ? '0 4px 12px rgba(91, 63, 187, 0.15)' : '0 2px 6px rgba(0,0,0,0.02)';
                    }}
                  >
                    <div style={avatarStyle(l.profilePhoto)}>
                      {!l.profilePhoto && initials}
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#111', lineHeight: '1.2' }}>{name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px', fontWeight: '500' }}>{l.position}</div>
                    {l.pa && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '6px', fontStyle: 'italic', backgroundColor: 'rgba(91, 63, 187, 0.08)', padding: '2px 6px', borderRadius: '4px' }}>
                        PA: {l.pa.first}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3 suggested slots */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ ...labelStyle, marginBottom: '12px' }}>Suggested Date Suggestions (3 Required)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {slots.map((slot, index) => (
              <div key={slot.id || index} style={{
                border: '1px solid #eee',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: '#fcfcfc'
              }}>
                <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--accent)', marginBottom: '8px' }}>
                  {index === 0 ? t('appointmentOption1') : index === 1 ? t('appointmentOption2') : t('appointmentOption3')}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ ...labelStyle, fontSize: '0.75rem', color: '#666' }}>{t('date')}</label>
                    <input 
                      type="date" 
                      value={slot.date} 
                      onChange={(e) => handleSlotChange(index, 'date', e.target.value)}
                      style={inputStyle} 
                      required 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ ...labelStyle, fontSize: '0.75rem', color: '#666' }}>{t('time')}</label>
                    <input 
                      type="time" 
                      value={slot.time} 
                      onChange={(e) => handleSlotChange(index, 'time', e.target.value)}
                      style={inputStyle} 
                      required 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>{t('reasonAppointment')}</label>
          <textarea 
            value={reason} 
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('howCanWeHelp')}
            style={{ ...inputStyle, height: '80px', resize: 'none', fontFamily: 'inherit' }}
            required
          />
        </div>

        <button type="submit" style={submitButtonStyle}>{t('requestAppointment')}</button>
      </form>

      {/* Your Appointments List */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>{t('yourAppointments')}</h3>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#999' }}>{t('loading')}</div>
        ) : myAppointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#999' }}>
            {t('noAppointmentsYet')}
          </div>
        ) : (
          myAppointments.map(app => (
            <div key={app.id} style={appointmentCardStyle}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#111' }}>{app.staff}</div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>{app.type}</div>
                
                {app.status === 'pending' ? (
                  <div style={{ fontSize: '0.8rem', color: '#444', marginTop: '8px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                    <div style={{ fontWeight: '600', marginBottom: '6px', fontSize: '0.75rem', color: 'var(--accent)' }}>Suggested Options:</div>
                    <div style={{ marginBottom: '2px' }}>1️⃣ {app.date1} at {app.time1}</div>
                    <div style={{ marginBottom: '2px' }}>2️⃣ {app.date2} at {app.time2}</div>
                    <div>3️⃣ {app.date3} at {app.time3}</div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', marginTop: '6px', color: app.status === 'approved' ? '#2e7d32' : '#c62828', fontWeight: '600' }}>
                    📅 {app.date} at {app.time}
                    {app.selectedSlot && <span style={{ fontSize: '0.75rem', opacity: 0.8, marginLeft: '8px', backgroundColor: 'rgba(46, 125, 50, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>(Option {app.selectedSlot})</span>}
                  </div>
                )}
                {app.pa && (
                  <div style={{ fontSize: '0.75rem', color: '#777', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>🛡️</span>
                    <span>{t('managedByPA') || 'Managed by PA'}: <strong>{app.pa.first} {app.pa.last}</strong></span>
                  </div>
                )}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                fontWeight: 'bold', 
                color: app.status === 'approved' ? '#2e7d32' : app.status === 'rejected' ? '#c62828' : 'var(--accent)', 
                backgroundColor: app.status === 'approved' ? '#e8f5e9' : app.status === 'rejected' ? '#ffebee' : 'rgba(91, 63, 187, 0.1)', 
                padding: '4px 10px', 
                borderRadius: '100px',
                alignSelf: 'flex-start'
              }}>
                {t(app.status) || app.status.toUpperCase()}
              </div>
            </div>
          ))
        )}
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

const leaderCardStyle = (isSelected) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '12px',
  borderRadius: '10px',
  backgroundColor: isSelected ? 'var(--accent-soft, #f4f2ff)' : 'white',
  border: isSelected ? '2px solid var(--accent)' : '1px solid #eee',
  cursor: 'pointer',
  transition: 'all 0.2s',
  textAlign: 'center',
  boxShadow: isSelected ? '0 4px 12px rgba(91, 63, 187, 0.15)' : '0 2px 6px rgba(0,0,0,0.02)',
  transform: isSelected ? 'scale(1.02)' : 'scale(1)'
});

const avatarStyle = (photo) => ({
  width: '50px',
  height: '50px',
  borderRadius: '25px',
  backgroundColor: 'var(--accent)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  marginBottom: '8px',
  backgroundImage: photo ? `url(${photo})` : 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  border: '1.5px solid #ddd',
  flexShrink: 0
});

export default AppointmentScreen;