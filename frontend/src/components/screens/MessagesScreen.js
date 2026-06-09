import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { listMembers } from '../../lib/dataconnect';
import { dataConnect } from '../../services/firebase';
import {
  getDirectChats,
  getGroupChats,
  createDirectChat,
  createGroupChat
} from '../../services/chatService';
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

const MessagesScreen = ({ user }) => {
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
    loadChats();
    loadAllUsers();
  }, [user?.uid]);

  const loadChats = async () => {
    if (!user?.uid) return;
    try {
      const directs = await getDirectChats(user.uid);
      const groups = await getGroupChats(user.uid);
      setDirectChats(directs);
      setGroupChats(groups);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
    setLoading(false);
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
    <div style={{ paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'white',
        padding: '24px',
        borderBottom: '1px solid #eee'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 4px 0', color: '#111' }}>
              {t('messages')}
            </h2>
            <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>
              {t('chatWithFriends')}
            </p>
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
                  <div style={{ fontWeight: '600', color: '#111' }}>{otherUserName}</div>
                </button>
              );
            })}
          </div>
        )}

        {/* Group Chats */}
        {groupChats.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111', margin: '0 0 12px 0' }}>
              {t('groups')} ({groupChats.length})
            </h3>
            {groupChats.map((group) => {
              const groupIcon = group.groupIcon || '👥';
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
                  <div>
                    <div style={{ fontWeight: '600', color: '#111' }}>{group.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '2px' }}>{group.members.length} {t('members').toLowerCase()}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

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
