import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  sendMessage,
  sendGroupMessage,
  listenToMessages,
  listenToGroupMessages,
  deleteMessage,
  deleteGroupMessage,
  editMessage,
  editGroupMessage
} from '../../services/chatService';

const ContextMenuOption = ({ onClick, children, style }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        backgroundColor: hovered ? '#f5f5f5' : 'transparent',
        border: 'none',
        padding: '10px 16px',
        textAlign: 'left',
        fontSize: '0.875rem',
        cursor: 'pointer',
        color: '#333',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'background-color 0.15s ease',
        outline: 'none',
        ...style
      }}
    >
      {children}
    </button>
  );
};

const ChatWindow = ({ chatId, chatType, user, onBack, chat }) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [contextMenu, setContextMenu] = useState({ x: 0, y: 0, show: false, message: null });
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyingToMessage, setReplyingToMessage] = useState(null);
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

    // Mark as read when messages update
    if (chatId) {
      const readStatuses = JSON.parse(localStorage.getItem('chatReadStatuses') || '{}');
      readStatuses[chatId] = Date.now();
      localStorage.setItem('chatReadStatuses', JSON.stringify(readStatuses));
      window.dispatchEvent(new Event('chatReadStatusesUpdated'));
    }
  }, [messages, chatId]);

  useEffect(() => {
    const handleCloseMenu = () => {
      setContextMenu({ x: 0, y: 0, show: false, message: null });
    };
    window.addEventListener('click', handleCloseMenu);
    return () => {
      window.removeEventListener('click', handleCloseMenu);
    };
  }, []);

  const handleContextMenu = (e, msg) => {
    e.preventDefault();
    const menuWidth = 150;
    const menuHeight = msg.userId === user?.uid ? 130 : 90;
    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10;
    }

    setContextMenu({
      x,
      y,
      show: true,
      message: msg
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleStartEdit = (msg) => {
    setEditingMessage(msg);
    setReplyingToMessage(null);
    setMessageText(msg.text);
  };

  const handleStartReply = (msg) => {
    setReplyingToMessage(msg);
    setEditingMessage(null);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setSending(true);
    try {
      if (editingMessage) {
        if (chatType === 'direct') {
          await editMessage(chatId, editingMessage.id, messageText);
        } else {
          await editGroupMessage(chatId, editingMessage.id, messageText);
        }
        setEditingMessage(null);
      } else {
        const replyToPayload = replyingToMessage ? {
          userName: replyingToMessage.userName,
          text: replyingToMessage.text
        } : null;

        if (chatType === 'direct') {
          await sendMessage(chatId, user.uid, `${user.first} ${user.last}`, messageText, replyToPayload);
        } else {
          await sendGroupMessage(chatId, user.uid, `${user.first} ${user.last}`, messageText, replyToPayload);
        }
        setReplyingToMessage(null);
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
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
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
                onContextMenu={(e) => handleContextMenu(e, msg)}
                style={{
                  backgroundColor: msg.userId === user?.uid ? 'var(--accent)' : '#f0f0f0',
                  color: msg.userId === user?.uid ? 'white' : '#111',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  borderBottomLeftRadius: msg.userId === user?.uid ? '16px' : '4px',
                  borderBottomRightRadius: msg.userId === user?.uid ? '4px' : '16px',
                  position: 'relative',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  cursor: 'context-menu',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
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

                {msg.replyTo && (
                  <div style={{
                    backgroundColor: msg.userId === user?.uid ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.05)',
                    borderLeft: `3px solid ${msg.userId === user?.uid ? 'rgba(255, 255, 255, 0.6)' : 'var(--accent)'}`,
                    padding: '6px 10px',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    fontSize: '0.8rem',
                    opacity: 0.95
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                      {msg.replyTo.userName}
                    </div>
                    <div style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontStyle: 'italic'
                    }}>
                      {msg.replyTo.text}
                    </div>
                  </div>
                )}

                <p style={{ margin: 0, fontSize: '0.95rem' }}>
                  {msg.text}
                </p>
                <div style={{
                  fontSize: '0.75rem',
                  opacity: 0.6,
                  marginTop: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {msg.isEdited && (
                    <span style={{ fontSize: '0.7rem', fontStyle: 'italic', opacity: 0.8 }}>
                      ({t('edited')})
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Banner for Editing/Replying */}
      {(editingMessage || replyingToMessage) && (
        <div style={{
          padding: '8px 24px',
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem',
          color: '#555'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {editingMessage ? (
              <>
                <span style={{ fontWeight: '600', color: 'var(--accent)' }}>✏️ {t('edit')}:</span>
                <span style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '300px',
                  fontStyle: 'italic'
                }}>
                  "{editingMessage.text}"
                </span>
              </>
            ) : (
              <>
                <span style={{ fontWeight: '600', color: 'var(--accent)' }}>↩️ {t('reply')} to {replyingToMessage.userName}:</span>
                <span style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '300px',
                  fontStyle: 'italic'
                }}>
                  "{replyingToMessage.text}"
                </span>
              </>
            )}
          </div>
          <button
            onClick={() => {
              setEditingMessage(null);
              setReplyingToMessage(null);
              if (editingMessage) {
                setMessageText('');
              }
            }}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#999',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              padding: '2px 8px'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: '8px',
        position: 'sticky',
        bottom: 0,
        backgroundColor: 'white',
        zIndex: 100
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

      {/* Context Menu */}
      {contextMenu.show && contextMenu.message && (
        <div style={{
          position: 'fixed',
          top: `${contextMenu.y}px`,
          left: `${contextMenu.x}px`,
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          zIndex: 10000,
          width: '150px',
          padding: '6px 0'
        }}>
          {contextMenu.message.userId === user?.uid ? (
            <>
              <ContextMenuOption onClick={() => handleCopy(contextMenu.message.text)}>
                📄 {t('copy')}
              </ContextMenuOption>
              <ContextMenuOption onClick={() => handleStartEdit(contextMenu.message)}>
                ✏️ {t('edit')}
              </ContextMenuOption>
              <ContextMenuOption
                onClick={() => handleDeleteMessage(contextMenu.message.id)}
                style={{ color: '#ff4d4f' }}
              >
                🗑️ {t('delete')}
              </ContextMenuOption>
            </>
          ) : (
            <>
              <ContextMenuOption onClick={() => handleStartReply(contextMenu.message)}>
                ↩️ {t('reply')}
              </ContextMenuOption>
              <ContextMenuOption onClick={() => handleCopy(contextMenu.message.text)}>
                📄 {t('copy')}
              </ContextMenuOption>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
