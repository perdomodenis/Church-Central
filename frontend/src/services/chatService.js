import { rtdb } from './firebase';
import { ref, push, set, get, update, query, orderByChild, limitToLast, onValue, remove } from 'firebase/database';

export const createDirectChat = async (userId1, userId2, user1Name, user2Name) => {
  const chatId = [userId1, userId2].sort().join('_');
  const snapshot = await get(ref(rtdb, `chats/${chatId}`));

  if (!snapshot.exists()) {
    await set(ref(rtdb, `chats/${chatId}`), {
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

export const createGroupChat = async (creatorId, groupName, memberIds, isPublic = false, groupIcon = '👥') => {
  const groupRef = push(ref(rtdb, 'groups'));
  const groupId = groupRef.key;

  const memberNames = {};
  await Promise.all(memberIds.map(async (memberId) => {
    const snapshot = await get(ref(rtdb, `users/${memberId}`));
    const userData = snapshot.val();
    memberNames[memberId] = userData?.displayName || 'Unknown';
  }));

  await set(groupRef, {
    type: 'group',
    name: groupName,
    creatorId,
    members: memberIds,
    memberNames,
    isPublic,
    groupIcon,
    createdAt: new Date().toISOString()
  });

  return groupId;
};

export const sendMessage = async (chatId, userId, userName, message, replyTo = null) => {
  const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
  const data = {
    userId,
    userName,
    text: message,
    timestamp: new Date().toISOString()
  };
  if (replyTo) {
    data.replyTo = replyTo;
  }
  await push(messagesRef, data);
  
  // Update last message summary on the chat object
  await update(ref(rtdb, `chats/${chatId}`), {
    lastMessage: data
  });
};

export const sendGroupMessage = async (groupId, userId, userName, message, replyTo = null) => {
  const messagesRef = ref(rtdb, `groups/${groupId}/messages`);
  const data = {
    userId,
    userName,
    text: message,
    timestamp: new Date().toISOString()
  };
  if (replyTo) {
    data.replyTo = replyTo;
  }
  await push(messagesRef, data);

  // Update last message summary on the group object
  await update(ref(rtdb, `groups/${groupId}`), {
    lastMessage: data
  });
};

export const getDirectChats = async (userId) => {
  try {
    const snapshot = await get(ref(rtdb, 'chats'));
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
    const snapshot = await get(ref(rtdb, 'groups'));
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

export const listenToUserDirectChats = (userId, callback) => {
  return onValue(ref(rtdb, 'chats'), (snapshot) => {
    const chats = [];
    snapshot.forEach((child) => {
      const chat = child.val();
      if (chat.type === 'direct' && chat.participants?.includes(userId)) {
        chats.push({
          id: child.key,
          ...chat
        });
      }
    });
    chats.sort((a,b) => {
       const aTime = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0;
       const bTime = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0;
       return bTime - aTime;
    });
    callback(chats);
  });
};

export const listenToUserGroupChats = (userId, callback) => {
  return onValue(ref(rtdb, 'groups'), (snapshot) => {
    const groups = [];
    snapshot.forEach((child) => {
      const group = child.val();
      if (group.members?.includes(userId)) {
        groups.push({
          id: child.key,
          ...group
        });
      }
    });
    groups.sort((a,b) => {
       const aTime = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0;
       const bTime = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0;
       return bTime - aTime;
    });
    callback(groups);
  });
};

export const listenToMessages = (chatId, callback) => {
  const messagesRef = query(
    ref(rtdb, `chats/${chatId}/messages`),
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
    ref(rtdb, `groups/${groupId}/messages`),
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
  await remove(ref(rtdb, `chats/${chatId}/messages/${messageId}`));
};

export const deleteGroupMessage = async (groupId, messageId) => {
  await remove(ref(rtdb, `groups/${groupId}/messages/${messageId}`));
};

export const getPublicGroups = async () => {
  try {
    const snapshot = await get(ref(rtdb, 'groups'));
    const groups = [];

    snapshot.forEach((child) => {
      const group = child.val();
      if (group.isPublic) {
        groups.push({
          id: child.key,
          ...group
        });
      }
    });

    return groups;
  } catch (error) {
    console.error('Error getting public groups:', error);
    return [];
  }
};

export const joinGroup = async (groupId, userId, userName) => {
  try {
    const groupRef = ref(rtdb, `groups/${groupId}`);
    const snapshot = await get(groupRef);

    if (snapshot.exists()) {
      const group = snapshot.val();
      const members = group.members || [];
      const memberNames = group.memberNames || {};

      if (!members.includes(userId)) {
        members.push(userId);
        memberNames[userId] = userName;

        await update(groupRef, {
          members,
          memberNames
        });
      }
    }
  } catch (error) {
    console.error('Error joining group:', error);
    throw error;
  }
};

export const syncUserChatGroups = async (userProfile) => {
  if (!userProfile || !userProfile.uid) return;

  // Cleanup old unwanted groups
  try {
    await Promise.all([
      remove(ref(rtdb, 'groups/system_court_main_campus')),
      remove(ref(rtdb, 'groups/system_court_main_campus_court')),
      remove(ref(rtdb, 'groups/system_district_central')),
      remove(ref(rtdb, 'groups/system_district_central_district'))
    ]);
  } catch (err) {
    // Ignore permissions or existence errors
  }

  const displayName = `${userProfile.first} ${userProfile.last}`.trim() || userProfile.email || 'Unknown';
  
  const targets = [];
  
  // Courts
  if (userProfile.courts && userProfile.courts.length > 0) {
    userProfile.courts.forEach(courtName => {
      if (courtName) {
        targets.push({
          category: 'court',
          name: courtName,
          key: `system_court_${courtName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          icon: '⛪'
        });
      }
    });
  } else if (userProfile.court) {
    targets.push({
      category: 'court',
      name: userProfile.court,
      key: `system_court_${userProfile.court.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      icon: '⛪'
    });
  }
  
  // Departments
  if (userProfile.depts && userProfile.depts.length > 0) {
    userProfile.depts.forEach(deptName => {
      if (deptName && deptName !== 'None' && deptName !== 'General') {
        targets.push({
          category: 'department',
          name: deptName,
          key: `system_dept_${deptName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          icon: '💼'
        });
      }
    });
  } else if (userProfile.dept && userProfile.dept !== 'None' && userProfile.dept !== 'General') {
    targets.push({
      category: 'department',
      name: userProfile.dept,
      key: `system_dept_${userProfile.dept.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      icon: '💼'
    });
  }
  
  // District
  const districtName = userProfile.district || 'District 1';
  targets.push({
    category: 'district',
    name: districtName,
    key: `system_district_${districtName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    icon: '🗺️'
  });

  await Promise.all(targets.map(async (target) => {
    try {
      const groupRef = ref(rtdb, `groups/${target.key}`);
      const snapshot = await get(groupRef);

      if (!snapshot.exists()) {
        await set(groupRef, {
          type: 'group',
          name: target.name,
          creatorId: 'system',
          members: [userProfile.uid],
          memberNames: {
            [userProfile.uid]: displayName
          },
          isPublic: true,
          isSystemGroup: true,
          category: target.category,
          groupIcon: target.icon,
          createdAt: new Date().toISOString()
        });
      } else {
        const group = snapshot.val();
        const members = group.members || [];
        const memberNames = group.memberNames || {};

        let needsUpdate = false;
        const updates = {};

        if (!members.includes(userProfile.uid)) {
          members.push(userProfile.uid);
          memberNames[userProfile.uid] = displayName;
          updates.members = members;
          updates.memberNames = memberNames;
          needsUpdate = true;
        }

        if (group.name !== target.name) {
          updates.name = target.name;
          needsUpdate = true;
        }

        if (needsUpdate) {
          await update(groupRef, updates);
        }
      }
    } catch (err) {
      console.error(`Error syncing group ${target.name}:`, err);
    }
  }));
};

export const editMessage = async (chatId, messageId, newText) => {
  await update(ref(rtdb, `chats/${chatId}/messages/${messageId}`), {
    text: newText,
    isEdited: true
  });
};

export const editGroupMessage = async (groupId, messageId, newText) => {
  await update(ref(rtdb, `groups/${groupId}/messages/${messageId}`), {
    text: newText,
    isEdited: true
  });
};

