import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { listMembers } from '../../lib/dataconnect';
import { dataConnect } from '../../services/firebase';
import {
  getDirectChats,
  getGroupChats,
  listenToUserDirectChats,
  listenToUserGroupChats,
  createDirectChat,
  createGroupChat
} from '../../services/chatService';
import { COURTS, DEPARTMENTS, DISTRICTS } from '../../services/churchConstants';
import ChatWindow from './ChatWindow';

const renderAvatar = (name, photoUrl) => {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '20px',
          objectFit: 'cover',
          marginRight: '12px',
          minWidth: '40px'
        }}
      />
    );
  }

  const initial = name ? name[0].toUpperCase() : '?';
  return (
    <div
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '20px',
        backgroundColor: 'var(--accent)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        marginRight: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        minWidth: '40px'
      }}
    >
      {initial}
    </div>
  );
};

const renderGroupAvatar = (name, icon) => {
  const groupIcon = icon || '👥';
  return (
    <div
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '20px',
        backgroundColor: '#eef2f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.3rem',
        marginRight: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0',
        minWidth: '40px'
      }}
    >
      {groupIcon}
    </div>
  );
};

const MessagesScreen = ({ user, onClose, isOverlay }) => {
  const { t } = useLanguage();
  const [directChats, setDirectChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatType, setChatType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [selectedGroupIcon, setSelectedGroupIcon] = useState('👥');

  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);

    const unsubscribeDirect = listenToUserDirectChats(user.uid, (chats) => {
      setDirectChats(chats);
      setLoading(false);
    });

    const unsubscribeGroups = listenToUserGroupChats(user.uid, (groups) => {
      setGroupChats(groups);
      setLoading(false);
    });

    loadAllUsers();

    return () => {
      unsubscribeDirect();
      unsubscribeGroups();
    };
  }, [user?.uid]);

  const loadChats = async () => {
    // Kept for manual refresh if needed, but primarily handled by real-time listeners now
    if (!user?.uid) return;
    const direct = await getDirectChats(user.uid);
    const groups = await getGroupChats(user.uid);
    setDirectChats(direct.sort((a,b) => (b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0) - (a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0)));
    setGroupChats(groups.sort((a,b) => (b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0) - (a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0)));
  };

  const loadAllUsers = async () => {
    try {
      const response = await listMembers(dataConnect);
      const members = response.data?.users || [];
      const mapped = members.reduce((acc, m) => {
        if (m.uid !== user?.uid) {
          acc.push({
            uid: m.uid,
            name: `${m.first} ${m.last}`.trim() || m.email || 'Unknown',
            profilePhoto: m.profilePhoto
          });
        }
        return acc;
      }, []);
      setAllUsers(mapped);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleStartChat = async (selectedUserId) => {
    const chatId = await createDirectChat(
      user.uid,
      selectedUserId,
      `${user.first} ${user.last}`,
      allUsers.find(u => u.uid === selectedUserId)?.name || 'User'
    );
    setSelectedChat(chatId);
    setChatType('direct');
    setShowNewChat(false);
    await loadChats();
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length === 0) return;

    try {
      const groupId = await createGroupChat(
        user.uid,
        groupName,
        [user.uid, ...selectedUsers],
        false,
        selectedGroupIcon
      );
      setSelectedChat(groupId);
      setChatType('group');
      setGroupName('');
      setSelectedUsers([]);
      setSelectedGroupIcon('👥');
      setShowNewGroup(false);
      await loadChats();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleMarkAllAsRead = () => {
    const readStatuses = JSON.parse(localStorage.getItem('chatReadStatuses') || '{}');
    const now = Date.now();
    let updated = false;

    groupChats.forEach(group => {
      if (group.lastMessage && group.lastMessage.userId !== user?.uid) {
        readStatuses[group.id] = now;
        updated = true;
      }
    });

    directChats.forEach(chat => {
      if (chat.lastMessage && chat.lastMessage.userId !== user?.uid) {
        readStatuses[chat.id] = now;
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem('chatReadStatuses', JSON.stringify(readStatuses));
      window.dispatchEvent(new Event('chatReadStatusesUpdated'));
      setDirectChats([...directChats]); // Force re-render
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const renderGroupCard = (group) => {
    const groupIcon = group.groupIcon || '👥';
    const readStatuses = JSON.parse(localStorage.getItem('chatReadStatuses') || '{}');
    const lastMsgTime = group.lastMessage ? new Date(group.lastMessage.timestamp).getTime() : 0;
    const isUnread = group.lastMessage && group.lastMessage.userId !== user?.uid && lastMsgTime > (readStatuses[group.id] || 0);

    return (
      <button
        key={group.id}
        onClick={() => {
          setSelectedChat(group.id);
          setChatType('group');
        }}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: 'white',
          border: '1px solid #eee',
          borderRadius: '12px',
          marginBottom: '8px',
          textAlign: 'left',
          cursor: 'pointer',
          transition: 'background-color 0.2s, transform 0.2s',
          display: 'flex',
          alignItems: 'center'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
      >
        {renderGroupAvatar(group.name, groupIcon)}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontWeight: isUnread ? '800' : '600', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.name}</div>
            {group.lastMessage && (
              <div style={{ fontSize: '0.75rem', color: isUnread ? 'var(--accent)' : '#999', flexShrink: 0, marginLeft: '8px', fontWeight: isUnread ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {isUnread && <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent)', borderRadius: '50%' }} />}
                {formatTime(group.lastMessage.timestamp)}
              </div>
            )}
          </div>
          {group.lastMessage ? (
            <div style={{ fontSize: '0.85rem', color: isUnread ? '#111' : '#666', fontWeight: isUnread ? '600' : 'normal', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
              <span style={{ fontWeight: '500' }}>{group.lastMessage.userId === user?.uid ? 'You' : group.lastMessage.userName}:</span> {group.lastMessage.text}
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: '#999', textAlign: 'left' }}>{group.members.length} {t('members').toLowerCase()}</div>
          )}
        </div>
      </button>
    );
  };

  if (selectedChat && chatType) {
    return (
      <ChatWindow
        chatId={selectedChat}
        chatType={chatType}
        user={user}
        onBack={() => {
          setSelectedChat(null);
          setChatType(null);
        }}
        chat={chatType === 'direct' ? directChats.find(c => c.id === selectedChat) : groupChats.find(c => c.id === selectedChat)}
      />
    );
  }

  return (
    <div style={{ paddingBottom: isOverlay ? '24px' : '100px', flex: 1, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'white',
        padding: '24px',
        borderBottom: '1px solid #eee'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 4px 0', color: '#111' }}>
              {t('messages')}
            </h2>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>
                {t('chatWithFriends')}
              </p>
              {(() => {
                const readStatuses = JSON.parse(localStorage.getItem('chatReadStatuses') || '{}');
                const hasUnread = [...groupChats, ...directChats].some(chat => {
                  const lastMsgTime = chat.lastMessage ? new Date(chat.lastMessage.timestamp).getTime() : 0;
                  return chat.lastMessage && chat.lastMessage.userId !== user?.uid && lastMsgTime > (readStatuses[chat.id] || 0);
                });
                return hasUnread ? (
                  <button
                    onClick={handleMarkAllAsRead}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'var(--accent)',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.8rem',
                      padding: 0
                    }}
                  >
                    Mark all as read
                  </button>
                ) : null;
              })()}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowNewChat(!showNewChat)}
              style={{
                backgroundColor: showNewChat ? 'var(--accent)' : '#f0f0f0',
                color: showNewChat ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
            >
              💬
            </button>
            <button
              onClick={() => setShowNewGroup(!showNewGroup)}
              style={{
                backgroundColor: showNewGroup ? 'var(--accent)' : '#f0f0f0',
                color: showNewGroup ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
            >
              👥
            </button>
            {isOverlay && onClose && (
              <button
                onClick={onClose}
                style={{
                  backgroundColor: 'transparent',
                  color: '#999',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  marginLeft: '8px'
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>
        {/* New Chat Form */}
        {showNewChat && (
          <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>{t('startConversation')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {allUsers.map((u) => (
                <button
                  key={u.uid}
                  onClick={() => handleStartChat(u.uid)}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: '500',
                    color: '#111',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#f9f9f9'}
                >
                  {u.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* New Group Form */}
        {showNewGroup && (
          <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>{t('createGroup')}</h3>
            <input
              type="text"
              placeholder={t('groupName')}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                marginBottom: '12px',
                boxSizing: 'border-box',
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
            />
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '600' }}>
              Select Group Icon
            </p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
              {['👥', '⛪', '💼', '🎶', '📖', '🗣️', '⚙️', '🗺️'].map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedGroupIcon(icon)}
                  style={{
                    fontSize: '1.4rem',
                    padding: '6px',
                    borderRadius: '10px',
                    border: selectedGroupIcon === icon ? '2px solid var(--accent)' : '1px solid #eee',
                    backgroundColor: selectedGroupIcon === icon ? '#f4f2ff' : 'white',
                    cursor: 'pointer',
                    width: '42px',
                    height: '42px',
                    minWidth: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '8px' }}>
              {t('selectMembers')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', maxHeight: '200px', overflowY: 'auto' }}>
              {allUsers.map((u) => (
                <label key={u.uid} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px' }}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(u.uid)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, u.uid]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== u.uid));
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ color: '#333' }}>{u.name}</span>
                </label>
              ))}
            </div>
            <button
              onClick={handleCreateGroup}
              disabled={!groupName || selectedUsers.length === 0}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: !groupName || selectedUsers.length === 0 ? '#ccc' : 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: !groupName || selectedUsers.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {t('createGroup')}
            </button>
          </div>
        )}

        {/* Direct Chats */}
        {directChats.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111', margin: '0 0 12px 0' }}>
              {t('directMessages')}
            </h3>
            {directChats.map((chat) => {
              const otherUserId = chat.participants.find(id => id !== user?.uid);
              const otherUserName = chat.participantNames[otherUserId];
              const otherUser = allUsers.find(u => u.uid === otherUserId);
              const profilePhoto = otherUser?.profilePhoto;

              const readStatuses = JSON.parse(localStorage.getItem('chatReadStatuses') || '{}');
              const lastMsgTime = chat.lastMessage ? new Date(chat.lastMessage.timestamp).getTime() : 0;
              const isUnread = chat.lastMessage && chat.lastMessage.userId !== user?.uid && lastMsgTime > (readStatuses[chat.id] || 0);

              return (
                <button
                  key={chat.id}
                  onClick={() => {
                    setSelectedChat(chat.id);
                    setChatType('direct');
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'white',
                    border: '1px solid #eee',
                    borderRadius: '12px',
                    marginBottom: '8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s, transform 0.2s',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  {renderAvatar(otherUserName, profilePhoto)}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div style={{ fontWeight: isUnread ? '800' : '600', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{otherUserName}</div>
                      {chat.lastMessage && (
                        <div style={{ fontSize: '0.75rem', color: isUnread ? 'var(--accent)' : '#999', flexShrink: 0, marginLeft: '8px', fontWeight: isUnread ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {isUnread && <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent)', borderRadius: '50%' }} />}
                          {formatTime(chat.lastMessage.timestamp)}
                        </div>
                      )}
                    </div>
                    {chat.lastMessage && (
                      <div style={{ fontSize: '0.85rem', color: isUnread ? '#111' : '#666', fontWeight: isUnread ? '600' : 'normal', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
                        <span style={{ fontWeight: '500' }}>{chat.lastMessage.userId === user?.uid ? 'You' : chat.lastMessage.userName}:</span> {chat.lastMessage.text}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Group Chats */}
        {groupChats.length > 0 && (() => {
          const courtGroups = [];
          const deptGroups = [];
          const districtGroups = [];
          const customGroups = [];

          groupChats.forEach(group => {
            const nameLower = group.name.toLowerCase();
            const isCourt = nameLower.includes('court') || COURTS.some(c => nameLower.includes(c.toLowerCase()));
            const isDept = nameLower.includes('department') || DEPARTMENTS.some(d => nameLower.includes(d.toLowerCase()));
            const isDistrict = nameLower.includes('district') || DISTRICTS.some(d => nameLower.includes(d.toLowerCase()));

            if (isCourt) {
              courtGroups.push(group);
            } else if (isDept) {
              deptGroups.push(group);
            } else if (isDistrict) {
              districtGroups.push(group);
            } else {
              customGroups.push(group);
            }
          });

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {courtGroups.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111', margin: '0 0 12px 0' }}>
                    ⛪ {t('courts') || 'Courts'} ({courtGroups.length})
                  </h3>
                  {courtGroups.map(renderGroupCard)}
                </div>
              )}
              
              {deptGroups.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111', margin: '0 0 12px 0' }}>
                    📁 {t('departments') || 'Departments'} ({deptGroups.length})
                  </h3>
                  {deptGroups.map(renderGroupCard)}
                </div>
              )}

              {districtGroups.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111', margin: '0 0 12px 0' }}>
                    📍 {t('districts') || 'Districts'} ({districtGroups.length})
                  </h3>
                  {districtGroups.map(renderGroupCard)}
                </div>
              )}

              {customGroups.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111', margin: '0 0 12px 0' }}>
                    👥 {t('customGroups') || 'Custom Groups'} ({customGroups.length})
                  </h3>
                  {customGroups.map(renderGroupCard)}
                </div>
              )}
            </div>
          );
        })()}

        {loading && <p style={{ color: '#999' }}>{t('loadingChats')}</p>}

        {!loading && directChats.length === 0 && groupChats.length === 0 && (
          <div style={{
            backgroundColor: '#f0f8ff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e0f0ff',
            marginBottom: '24px'
          }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '12px', color: '#667eea', fontWeight: 'bold' }}>👋 {t('welcomeMessages')}</p>
            <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '12px', lineHeight: '1.5' }}>
              {t('messagesSubtitle')}
            </p>
            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              <button
                onClick={() => setShowNewChat(!showNewChat)}
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.95rem'
                }}
              >
                💬 {t('startConversation')}
              </button>
              <button
                onClick={() => setShowNewGroup(!showNewGroup)}
                style={{
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.95rem',
                  opacity: 0.8
                }}
              >
                👥 {t('createGroup')}
              </button>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '20px',
  marginBottom: '20px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  border: '1px solid #f0f0f0'
};

const sectionTitleStyle = {
  fontSize: '1.1rem',
  fontWeight: '700',
  color: '#111',
  margin: '0 0 16px 0'
};

export default MessagesScreen;
