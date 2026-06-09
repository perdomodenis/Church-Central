import { listMembers, getUserProfile } from '../lib/dataconnect';
import { dataConnect } from './firebase';

export const getAllMembers = async () => {
  try {
    const response = await listMembers(dataConnect);
    return response.data?.users || [];
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
    const response = await getUserProfile(dataConnect, { uid: userId });
    return response.data?.user || null;
  } catch (error) {
    console.error('Error fetching member profile:', error);
    return null;
  }
};

