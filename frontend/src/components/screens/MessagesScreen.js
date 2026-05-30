import React, { useState, useEffect } from 'react';
import { rtdb } from '../../services/firebase';
import { get, ref } from 'firebase/database';
import {
  getDirectChats,
  getGroupChats,
  createDirectChat,
  createGroupChat
} from '../../services/chatService';
import ChatWindow from './ChatWindow';

const MessagesScreen = ({ user }) => {
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
      const snapshot = await get(ref(rtdb, 'users'));
      const users = [];
      snapshot.forEach((child) => {
        if (child.key !== user?.uid) {
          users.push({
            uid: child.key,
            name: child.val()?.displayName || 'Unknown'
          });
        }
      });
      setAllUsers(users);
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
        [user.uid, ...selectedUsers]
      );
      setSelectedChat(groupId);
      setChatType('group');
      setGroupName('');
      setSelectedUsers([]);
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
              Messages
            </h2>
            <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>
              Chat with friends & groups
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
            <h3 style={sectionTitleStyle}>Start a Conversation</h3>
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
            <h3 style={sectionTitleStyle}>Create Group</h3>
            <input
              type="text"
              placeholder="Group Name"
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
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '8px' }}>
              Select members:
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
              Create Group
            </button>
          </div>
        )}

        {/* Direct Chats */}
        {directChats.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111', margin: '0 0 12px 0' }}>
              Direct Messages
            </h3>
            {directChats.map((chat) => {
              const otherUserId = chat.participants.find(id => id !== user?.uid);
              const otherUserName = chat.participantNames[otherUserId];
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
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f9f9f9'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                >
                  <div style={{ fontWeight: '600', color: '#111' }}>💬 {otherUserName}</div>
                </button>
              );
            })}
          </div>
        )}

        {/* Group Chats */}
        {groupChats.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111', margin: '0 0 12px 0' }}>
              Groups ({groupChats.length})
            </h3>
            {groupChats.map((group) => (
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
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f9f9f9'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
              >
                <div style={{ fontWeight: '600', color: '#111' }}>👥 {group.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#999' }}>{group.members.length} members</div>
              </button>
            ))}
          </div>
        )}

        {loading && <p style={{ color: '#999' }}>Loading chats...</p>}

        {!loading && directChats.length === 0 && groupChats.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
            <p style={{ fontSize: '2rem', marginBottom: '8px' }}>💬</p>
            <p>No chats yet. Start a conversation or create a group!</p>
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
