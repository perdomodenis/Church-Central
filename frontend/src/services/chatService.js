import { db } from './firebase';
import { ref, push, set, get, update, query, orderByChild, limitToLast, onValue, remove } from 'firebase/database';

export const createDirectChat = async (userId1, userId2, user1Name, user2Name) => {
  const chatId = [userId1, userId2].sort().join('_');
  const snapshot = await get(ref(db, `chats/${chatId}`));

  if (!snapshot.exists()) {
    await set(ref(db, `chats/${chatId}`), {
      type: 'direct',
      participants: [userId1, userId2],
      participantNames: {
        [userId1]: user1Name,
        [userId2]: user2Name
      },
      createdAt: new Date().toISOString()
    });
  }

  return chatId;
};

export const createGroupChat = async (creatorId, groupName, memberIds) => {
  const groupRef = push(ref(db, 'groups'));
  const groupId = groupRef.key;

  const memberNames = {};
  for (const memberId of memberIds) {
    const snapshot = await get(ref(db, `users/${memberId}`));
    const userData = snapshot.val();
    memberNames[memberId] = userData?.displayName || 'Unknown';
  }

  await set(groupRef, {
    type: 'group',
    name: groupName,
    creatorId,
    members: memberIds,
    memberNames,
    createdAt: new Date().toISOString()
  });

  return groupId;
};

export const sendMessage = async (chatId, userId, userName, message) => {
  const messagesRef = ref(db, `chats/${chatId}/messages`);
  await push(messagesRef, {
    userId,
    userName,
    text: message,
    timestamp: new Date().toISOString()
  });
};

export const sendGroupMessage = async (groupId, userId, userName, message) => {
  const messagesRef = ref(db, `groups/${groupId}/messages`);
  await push(messagesRef, {
    userId,
    userName,
    text: message,
    timestamp: new Date().toISOString()
  });
};

export const getDirectChats = async (userId) => {
  try {
    const snapshot = await get(ref(db, 'chats'));
    const chats = [];

    snapshot.forEach((child) => {
      const chat = child.val();
      if (chat.type === 'direct' && chat.participants.includes(userId)) {
        chats.push({
          id: child.key,
          ...chat
        });
      }
    });

    return chats;
  } catch (error) {
    console.error('Error getting chats:', error);
    return [];
  }
};

export const getGroupChats = async (userId) => {
  try {
    const snapshot = await get(ref(db, 'groups'));
    const groups = [];

    snapshot.forEach((child) => {
      const group = child.val();
      if (group.members.includes(userId)) {
        groups.push({
          id: child.key,
          ...group
        });
      }
    });

    return groups;
  } catch (error) {
    console.error('Error getting groups:', error);
    return [];
  }
};

export const listenToMessages = (chatId, callback) => {
  const messagesRef = query(
    ref(db, `chats/${chatId}/messages`),
    orderByChild('timestamp'),
    limitToLast(50)
  );

  return onValue(messagesRef, (snapshot) => {
    const messages = [];
    snapshot.forEach((child) => {
      messages.push({
        id: child.key,
        ...child.val()
      });
    });
    callback(messages);
  });
};

export const listenToGroupMessages = (groupId, callback) => {
  const messagesRef = query(
    ref(db, `groups/${groupId}/messages`),
    orderByChild('timestamp'),
    limitToLast(50)
  );

  return onValue(messagesRef, (snapshot) => {
    const messages = [];
    snapshot.forEach((child) => {
      messages.push({
        id: child.key,
        ...child.val()
      });
    });
    callback(messages);
  });
};

export const deleteMessage = async (chatId, messageId) => {
  await remove(ref(db, `chats/${chatId}/messages/${messageId}`));
};

export const deleteGroupMessage = async (groupId, messageId) => {
  await remove(ref(db, `groups/${groupId}/messages/${messageId}`));
};
