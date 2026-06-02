import React from 'react';

const MOCK_MESSAGES = [
  {
    id: 1,
    sender: 'Admin Office',
    subject: 'Important: Church-wide Meeting Next Week',
    preview: 'Dear members, please note there will be a mandatory church-wide meeting...',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    sender: 'Youth Ministry',
    subject: 'Youth Retreat Photos Are Here!',
    preview: 'Check out all the amazing moments from our recent youth retreat...',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 3,
    sender: 'Pastor John',
    subject: 'A Word of Encouragement',
    preview: 'I wanted to share a quick word of encouragement with all of you this week...',
    time: '3 days ago',
    read: true,
  },
  {
    id: 4,
    sender: 'Finance Department',
    subject: 'Annual Giving Statement Available',
    preview: 'Your annual giving statement for the past year is now available...',
    time: '1 week ago',
    read: false,
  },
];

const InboxScreen = () => {
  return (
    <div className="inbox-screen" style={{ padding: '12px' }}>
      {MOCK_MESSAGES.length > 0 ? (
        MOCK_MESSAGES.map(message => (
          <div key={message.id} style={messageCardStyle(message.read)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ fontWeight: message.read ? 'normal' : 'bold', fontSize: '1rem', color: message.read ? '#555' : '#333' }}>
                {message.sender}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{message.time}</div>
            </div>
            <div style={{ fontWeight: message.read ? 'normal' : 'bold', marginBottom: '4px', color: '#333' }}>
              {message.subject}
            </div>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {message.preview}
            </p>
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
          <p>Your inbox is empty.</p>
        </div>
      )}
    </div>
  );
};

const messageCardStyle = (read) => ({
  backgroundColor: read ? '#f9f9f9' : 'white',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '12px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  borderLeft: read ? 'none' : '4px solid var(--accent)',
});

export default InboxScreen;