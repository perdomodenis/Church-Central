import { rtdb } from './firebase';
import { ref, get } from 'firebase/database';

export const getAllMembers = async () => {
  try {
    const snapshot = await get(ref(rtdb, 'users'));
    if (!snapshot.exists()) {
      return [];
    }
    const data = snapshot.val();
    return Object.keys(data).map(uid => ({
      uid,
      ...data[uid]
    }));
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
};

export const searchMembers = async (query) => {
  try {
    const allMembers = await getAllMembers();
    if (!query.trim()) {
      return allMembers;
    }

    const lowerQuery = query.toLowerCase();
    return allMembers.filter(member => {
      const first = (member.first || '').toLowerCase();
      const last = (member.last || '').toLowerCase();
      const email = (member.email || '').toLowerCase();
      const dept = (member.dept || '').toLowerCase();

      return (
        first.includes(lowerQuery) ||
        last.includes(lowerQuery) ||
        email.includes(lowerQuery) ||
        dept.includes(lowerQuery)
      );
    });
  } catch (error) {
    console.error('Error searching members:', error);
    return [];
  }
};

export const getMemberProfile = async (userId) => {
  try {
    const snapshot = await get(ref(rtdb, `users/${userId}`));
    if (snapshot.exists()) {
      return {
        uid: userId,
        ...snapshot.val()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching member profile:', error);
    return null;
  }
};
