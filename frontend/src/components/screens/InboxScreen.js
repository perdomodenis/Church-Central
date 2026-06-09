import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const InboxScreen = () => {
  const { t } = useLanguage();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);

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
          ← {t('back')}
        </button>

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
        </div>
      </div>
    );
  }

  return (
    <div className="inbox-screen" style={{ padding: '24px', paddingBottom: '100px' }}>
      <h2 style={{ margin: '0 0 20px 0', color: '#111', fontSize: '1.5rem', fontWeight: '700' }}>
        {t('inbox')}
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

export default InboxScreen;