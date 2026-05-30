import React, { useState } from 'react';

const CHURCH_MESSAGES = [
  {
    id: 1,
    sender: 'James Peterson',
    subject: '✨ Sunday Service - "Grace Unfolded" - Don\'t Miss It!',
    preview: 'This Sunday at 10 AM we continue our series on God\'s relentless grace...',
    body: 'Dear Grace Community Family,\n\nThis Sunday at 10 AM we continue our series "Grace Unfolded" where we explore God\'s never-ending grace in our lives.\n\nService Details:\n📍 Main Campus & Downtown Campus\n⏰ 10:00 AM - 11:30 AM\n☕ Coffee & fellowship from 9:45 AM\n\nBring your family and friends!\n\nBlessings,\nPastor James',
    time: 'hace 1 hora',
    read: false,
  },
  {
    id: 2,
    sender: 'Juan Rivera',
    subject: '🎒 Youth Summer Camp - Registration Closing Soon!',
    preview: 'Only 2 spots left! June 21-25 at Rocky Mountain Camp...',
    body: 'Youth Group!\n\nOnly 2 SPOTS LEFT for our Youth Summer Camp!\n\nCamp Details:\n📅 June 21-25, 2025\n🏕️ Rocky Mountain Camp, Estes Park\n💰 $299 (Early bird price until May 31)\n\nActivities:\n• Worship & Teaching\n• Outdoor Adventures\n• Team Challenges\n• Friendship & Fellowship\n\nRegister NOW at the youth table or contact me!\n\nIn Christ,\nJuan Rivera\nYouth Director',
    time: 'hace 3 horas',
    read: false,
  },
  {
    id: 3,
    sender: 'Rachel Thompson',
    subject: '🎵 Worship Band Rehearsal - Friday 7 PM',
    preview: 'Preparing something special for Sunday\'s service...',
    body: 'Hi Worship Team,\n\nOur worship band rehearsal is THIS FRIDAY at 7 PM in the Worship Center.\n\nWe\'re rehearsing 3 new songs for Sunday\'s service that will absolutely bless our congregation!\n\nSee you then!\n\n🎵 Rachel',
    time: 'hace 5 horas',
    read: true,
  },
  {
    id: 4,
    sender: 'Sofia Garcia',
    subject: '❤️ Food Bank Volunteer Day - TODAY 9 AM',
    preview: 'Pack food for 500 families - We need YOUR help!',
    body: 'Prayer Warriors & Servants,\n\nTODAY at 9 AM we\'re at the Denver Food Bank packing food for 500 families!\n\n📍 Denver Food Bank, 250 Park Ave W\n⏰ 9:00 AM - 12:00 PM\n\nBring:\n• Comfortable clothing\n• Water\n• A servant\'s heart\n\nWe already have 18 volunteers signed up - join us!\n\nIn love,\nSofia Garcia\nCommunity Outreach',
    time: 'hace 8 horas',
    read: true,
  },
  {
    id: 5,
    sender: 'Mark Anderson',
    subject: '📖 Bible Study - Psalms Deep Dive - This Wednesday',
    preview: 'Join us for an in-depth study of selected Psalms...',
    body: 'Bible Study Community,\n\nThis Wednesday at 7 PM we continue our study:\n\n"PSALMS & PRAYER"\n8-week deep dive into the Psalms\n\n📍 Main Campus - Fellowship Hall\n⏰ 7:00 PM - 8:30 PM\n☕ Coffee & snacks from 6:45 PM\n\nThis week: Psalms 23, 42, 137\n(Comfort, Longing, Lament)\n\nAll levels welcome!\n\nIn the Word,\nMark Anderson',
    time: '1 día atrás',
    read: true,
  },
  {
    id: 6,
    sender: 'Patricia White',
    subject: '🙏 Prayer Request - Chen Family Newborn & Robert\'s Healing',
    preview: 'Please lift these families in prayer this week...',
    body: 'Prayer Partners,\n\nPlease intercede for:\n\n1. The Chen Family - welcoming baby Grace to their family! Prayers for health, blessing, and rest for parents.\n\n2. Brother Robert - recovering from surgery. Prayers for rapid healing and God\'s strength during recovery.\n\n3. The Martinez Family - still rebuilding after the fire. Prayers for provision and restoration.\n\nLet\'s cover these in prayer!\n\n🙏 Patricia White\nPrayer Coordinator',
    time: '2 días atrás',
    read: false,
  },
];

const InboxScreen = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState(CHURCH_MESSAGES);

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