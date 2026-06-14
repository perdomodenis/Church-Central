import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { rtdb } from '../../services/firebase';
import { ref, onValue, set as rtdbSet } from 'firebase/database';
import { approveAppointment, rejectAppointment } from '../../services/appointmentService';
import { sendInboxNotificationByEmail } from '../../services/notificationService';

const InboxScreen = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user) return;
    const inboxRef = ref(rtdb, `inbox/${user.uid}`);
    const unsubscribe = onValue(inboxRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({
          id,
          ...val
        })).sort((a, b) => b.timestamp - a.timestamp);
        setMessages(list);
      } else {
        setMessages([]);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const handleOpenMessage = (messageId) => {
    setSelectedMessage(messageId);
    if (user) {
      rtdbSet(ref(rtdb, `inbox/${user.uid}/${messageId}/read`), true);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    const updates = {};
    messages.forEach(msg => {
      if (!msg.read) {
        updates[`${msg.id}/read`] = true;
      }
    });
    if (Object.keys(updates).length > 0) {
      const { update } = await import('firebase/database');
      await update(ref(rtdb, `inbox/${user.uid}`), updates);
    }
  };

  const handleApproveFromInbox = async (appointmentId, selectedSlot, date, time) => {
    try {
      await approveAppointment(appointmentId, user?.displayName || user?.email || 'Admin', selectedSlot, date, time);
      
      const message = messages.find(m => m.id === selectedMessage);
      if (message) {
        await rtdbSet(ref(rtdb, `inbox/${user.uid}/${selectedMessage}/appointmentStatus`), 'approved');
        await rtdbSet(ref(rtdb, `inbox/${user.uid}/${selectedMessage}/body`), 
          message.body + `\n\n Status: Approved for ${date} at ${time}.`
        );
        
        if (message.requesterEmail) {
          await sendInboxNotificationByEmail(message.requesterEmail, {
            sender: user?.displayName || 'CCI Staff',
            senderId: user?.uid || 'system',
            subject: 'Appointment Approved',
            preview: `Your appointment request has been approved for ${date} at ${time}.`,
            body: `Hi!\n\nYour appointment request has been approved.\n\nScheduled Date & Time:\n- Date: ${date}\n- Time: ${time}\n\nThank you!`
          });
        }
      }

      alert('Appointment approved!');
      setSelectedMessage(null);
    } catch (error) {
      alert('Error approving appointment: ' + error.message);
    }
  };

  const handleRejectFromInbox = async (appointmentId) => {
    try {
      const reason = 'Not approved at this time';
      await rejectAppointment(appointmentId, user?.displayName || user?.email || 'Admin', reason);

      const message = messages.find(m => m.id === selectedMessage);
      if (message) {
        await rtdbSet(ref(rtdb, `inbox/${user.uid}/${selectedMessage}/appointmentStatus`), 'rejected');
        await rtdbSet(ref(rtdb, `inbox/${user.uid}/${selectedMessage}/body`), 
          message.body + `\n\n Status: Declined.`
        );

        if (message.requesterEmail) {
          await sendInboxNotificationByEmail(message.requesterEmail, {
            sender: user?.displayName || 'CCI Staff',
            senderId: user?.uid || 'system',
            subject: 'Appointment Declined',
            preview: `Your appointment request was declined.`,
            body: `Hi!\n\nYour appointment request could not be scheduled at this time.\n\nReason: ${reason}`
          });
        }
      }

      alert('Appointment rejected.');
      setSelectedMessage(null);
    } catch (error) {
      alert('Error rejecting appointment: ' + error.message);
    }
  };

  if (selectedMessage) {
    const message = messages.find(m => m.id === selectedMessage);
    return (
      <div style={{ padding: '24px', paddingBottom: '100px' }}>
        <button
          onClick={() => setSelectedMessage(null)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--accent)',
            cursor: 'pointer',
            fontSize: '1.5rem',
            marginBottom: '16px'
          }}
        >
          ← {t('back')}
        </button>

        {message && (
          <div style={cardStyle}>
            <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
              <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 8px 0' }}>{t('from')}: {message.sender}</p>
              <h2 style={{ margin: '0 0 8px 0', color: '#111', fontSize: '1.3rem', fontWeight: '700' }}>
                {message.subject}
              </h2>
              <p style={{ color: '#999', fontSize: '0.85rem', margin: 0 }}>{message.time}</p>
            </div>

            <div style={{
              color: '#333',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {message.body}
            </div>

            {message.isAppointmentRequest && !message.appointmentStatus && (
              <div style={{ marginTop: '24px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <p style={{ fontWeight: '700', fontSize: '0.9rem', color: '#666', marginBottom: '12px' }}>
                  Select slot option to approve directly:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {message.date1 && message.time1 && (
                    <button
                      onClick={() => handleApproveFromInbox(message.appointmentId, 1, message.date1, message.time1)}
                      style={inboxSlotButtonStyle}
                    >
                      Option 1: {message.date1} at {message.time1}
                    </button>
                  )}
                  {message.date2 && message.time2 && (
                    <button
                      onClick={() => handleApproveFromInbox(message.appointmentId, 2, message.date2, message.time2)}
                      style={inboxSlotButtonStyle}
                    >
                      Option 2: {message.date2} at {message.time2}
                    </button>
                  )}
                  {message.date3 && message.time3 && (
                    <button
                      onClick={() => handleApproveFromInbox(message.appointmentId, 3, message.date3, message.time3)}
                      style={inboxSlotButtonStyle}
                    >
                      Option 3: {message.date3} at {message.time3}
                    </button>
                  )}
                  <button
                    onClick={() => handleRejectFromInbox(message.appointmentId)}
                    style={inboxDeclineButtonStyle}
                  >
                     Decline Request
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="inbox-screen" style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#111', fontSize: '1.5rem', fontWeight: '700' }}>
          {t('inbox')}
        </h2>
        {messages.some(m => !m.read) && (
          <button
            onClick={handleMarkAllAsRead}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--accent)',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              padding: '4px 8px'
            }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {messages.length > 0 ? (
        messages.map(message => (
          <button
            key={message.id}
            onClick={() => handleOpenMessage(message.id)}
            style={{
              ...messageCardStyle(message.read),
              cursor: 'pointer',
              transition: 'box-shadow 0.2s, transform 0.2s',
              width: '100%',
              textAlign: 'left'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = messageCardStyle(message.read).boxShadow;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ fontWeight: message.read ? 'normal' : 'bold', fontSize: '1rem', color: message.read ? '#555' : '#333' }}>
                {message.sender}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{message.time}</div>
            </div>
            <div style={{ fontWeight: message.read ? 'normal' : 'bold', marginBottom: '4px', color: '#333' }}>
              {message.subject}
            </div>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
              {message.preview}
            </p>
          </button>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
          <p>{t('emptyInbox')}</p>
        </div>
      )}
    </div>
  );
};

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '20px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  border: '1px solid #f0f0f0'
};

const messageCardStyle = (read) => ({
  backgroundColor: read ? '#f9f9f9' : 'white',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '12px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  borderLeft: read ? 'none' : '4px solid var(--accent)',
  border: 'none'
});

const inboxSlotButtonStyle = {
  backgroundColor: '#f4f2ff',
  color: 'var(--accent)',
  border: '1px solid var(--accent)',
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '0.9rem',
  fontWeight: '600',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background-color 0.2s, color 0.2s',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px'
};

const inboxDeclineButtonStyle = {
  backgroundColor: 'transparent',
  color: '#d32f2f',
  border: '1px solid #d32f2f',
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '0.9rem',
  fontWeight: '600',
  textAlign: 'center',
  cursor: 'pointer',
  marginTop: '8px',
  transition: 'background-color 0.2s'
};

export default InboxScreen;