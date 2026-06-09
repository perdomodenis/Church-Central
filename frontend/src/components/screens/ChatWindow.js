import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  sendMessage,
  sendGroupMessage,
  listenToMessages,
  listenToGroupMessages,
  deleteMessage,
  deleteGroupMessage
} from '../../services/chatService';

const ChatWindow = ({ chatId, chatType, user, onBack, chat }) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let unsubscribe;

    if (chatType === 'direct') {
      unsubscribe = listenToMessages(chatId, setMessages);
    } else {
      unsubscribe = listenToGroupMessages(chatId, setMessages);
    }

    return () => unsubscribe?.();
  }, [chatId, chatType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setSending(true);
    try {
      if (chatType === 'direct') {
        await sendMessage(chatId, user.uid, `${user.first} ${user.last}`, messageText);
      } else {
        await sendGroupMessage(chatId, user.uid, `${user.first} ${user.last}`, messageText);
      }
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setSending(false);
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      if (chatType === 'direct') {
        await deleteMessage(chatId, messageId);
      } else {
        await deleteGroupMessage(chatId, messageId);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const getOtherUserName = () => {
    if (chatType === 'direct' && chat) {
      const otherUserId = chat.participants.find(id => id !== user?.uid);
      return chat.participantNames[otherUserId] || 'User';
    }
    return chat?.name || 'Group';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#fff'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #eee',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button
          onClick={onBack}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--accent)',
            cursor: 'pointer',
            fontSize: '1.5rem'
          }}
        >
          ←
        </button>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <h3 style={{ margin: '0 0 4px 0', color: '#111', fontWeight: '700' }}>
            {chatType === 'group' ? '👥' : '💬'} {getOtherUserName()}
          </h3>
          {chatType === 'group' && chat?.members && (
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>
              {chat.members.length} {t('members').toLowerCase()}
            </p>
          )}
        </div>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.length === 0 ? (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            textAlign: 'center'
          }}>
            <p>{t('noMessagesYet')}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.userId === user?.uid ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}
            >
              <div
                style={{
                  backgroundColor: msg.userId === user?.uid ? 'var(--accent)' : '#f0f0f0',
                  color: msg.userId === user?.uid ? 'white' : '#111',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  borderBottomLeftRadius: msg.userId === user?.uid ? '16px' : '4px',
                  borderBottomRightRadius: msg.userId === user?.uid ? '4px' : '16px',
                  position: 'relative',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {chatType === 'group' && msg.userId !== user?.uid && (
                  <div style={{
                    fontSize: '0.75rem',
                    opacity: 0.7,
                    marginBottom: '4px',
                    fontWeight: '600'
                  }}>
                    {msg.userName}
                  </div>
                )}
                <p style={{ margin: 0, fontSize: '0.95rem' }}>
                  {msg.text}
                </p>
                <div style={{
                  fontSize: '0.7rem',
                  opacity: 0.6,
                  marginTop: '4px'
                }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>

                {msg.userId === user?.uid && (
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      padding: '2px 4px'
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: '8px'
      }}>
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={t('typeMessage')}
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '20px',
            fontSize: '0.95rem',
            fontFamily: 'inherit',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={sending || !messageText.trim()}
          style={{
            backgroundColor: sending || !messageText.trim() ? '#ccc' : 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            cursor: sending || !messageText.trim() ? 'not-allowed' : 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
