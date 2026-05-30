import React, { useState } from 'react';

const MOCK_MESSAGES = [
  {
    id: 1,
    sender: 'Admin Office',
    subject: 'Important: Church-wide Meeting Next Week',
    preview: 'Dear members, please note there will be a mandatory church-wide meeting...',
    body: 'Dear members,\n\nPlease note there will be a mandatory church-wide meeting next week on Saturday at 10:00 AM. This meeting is important for all members to attend.\n\nWe will be discussing upcoming events and initiatives.\n\nLocation: Main Hall\nTime: 10:00 AM\nDate: Saturday\n\nLooking forward to seeing you there!',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    sender: 'Youth Ministry',
    subject: 'Youth Retreat Photos Are Here!',
    preview: 'Check out all the amazing moments from our recent youth retreat...',
    body: 'Hi Youth Group!\n\nCheck out all the amazing moments from our recent youth retreat! The photos are now available in our shared album.\n\nThanks to everyone who participated. It was an incredible experience!\n\nView the album: [Link]\n\nSee you at the next event!',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 3,
    sender: 'Pastor John',
    subject: 'A Word of Encouragement',
    preview: 'I wanted to share a quick word of encouragement with all of you this week...',
    body: 'Dear Beloved,\n\nI wanted to share a quick word of encouragement with all of you this week.\n\nNo matter what challenges you may be facing, remember that God is with you. His love never fails, and His grace is sufficient for all our needs.\n\nLet us continue to support one another in prayer and in love.\n\nBlessings,\nPastor John',
    time: '3 days ago',
    read: true,
  },
  {
    id: 4,
    sender: 'Finance Department',
    subject: 'Annual Giving Statement Available',
    preview: 'Your annual giving statement for the past year is now available...',
    body: 'Dear Member,\n\nYour annual giving statement for the past year is now available in your account.\n\nYou can download it from your profile page under "Documents".\n\nThank you for your generous contributions to our church community!\n\nIf you have any questions, please contact the Finance Department.',
    time: '1 week ago',
    read: false,
  },
];

const InboxScreen = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const handleOpenMessage = (messageId) => {
    setSelectedMessage(messageId);
    setMessages(messages.map(msg =>
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
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
          ← Back
        </button>

        <div style={cardStyle}>
          <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 8px 0' }}>From: {message.sender}</p>
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
        </div>
      </div>
    );
  }

  return (
    <div className="inbox-screen" style={{ padding: '24px', paddingBottom: '100px' }}>
      <h2 style={{ margin: '0 0 20px 0', color: '#111', fontSize: '1.5rem', fontWeight: '700' }}>
        Inbox
      </h2>

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
          <p>Your inbox is empty.</p>
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

export default InboxScreen;