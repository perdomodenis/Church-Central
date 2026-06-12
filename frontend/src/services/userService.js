import { storage } from './firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  getUserProfile as fetchUserProfileFromDb,
  upsertUserProfile as upsertUserProfileInDb
} from '../lib/dataconnect';
import { syncUserChatGroups } from './chatService';

export const updateProfilePhoto = async (userId, file) => {
  const photoRef = storageRef(storage, `users/${userId}/profile-photo`);
  await uploadBytes(photoRef, file);
  const url = await getDownloadURL(photoRef);
  updateUserProfile(userId, { profilePhoto: url });
  return url;
};

export const updateUserProfile = async (userId, data) => {
  const currentProfile = await getUserProfile(userId);
  const merged = {
    uid: userId,
    email: currentProfile.email || data.email || '',
    first: currentProfile.first || data.first || '',
    last: currentProfile.last || data.last || '',
    zip: currentProfile.zip || data.zip || '',
    city: currentProfile.city || data.city || '',
    court: currentProfile.court || data.court || '',
    courts: currentProfile.courts || data.courts || [],
    dept: currentProfile.dept || data.dept || '',
    depts: currentProfile.depts || data.depts || [],
    district: currentProfile.district || data.district || '',
    gender: currentProfile.gender || data.gender || '',
    schoolClass: currentProfile.schoolClass || data.schoolClass || '',
    position: currentProfile.position || data.position || '',
    bio: currentProfile.bio || data.bio || '',
    profilePhoto: currentProfile.profilePhoto || data.profilePhoto || '',
    joined: currentProfile.joined || data.joined || '',
    lastActive: currentProfile.lastActive || data.lastActive || new Date().toISOString(),
    status: currentProfile.status || data.status || 'online',
    recentActivity: currentProfile.recentActivity || data.recentActivity || '',
    interests: currentProfile.interests || data.interests || [],
    authorizedPostAsChurch: currentProfile.authorizedPostAsChurch !== undefined ? currentProfile.authorizedPostAsChurch : false,
    authorizedPostAsDept: currentProfile.authorizedPostAsDept !== undefined ? currentProfile.authorizedPostAsDept : false,
    authorizedPostAsCourt: currentProfile.authorizedPostAsCourt !== undefined ? currentProfile.authorizedPostAsCourt : false,
    authorizedCreateProgram: currentProfile.authorizedCreateProgram !== undefined ? currentProfile.authorizedCreateProgram : false,
    ...data
  };

  // Sync backwards compatible single fields
  if (merged.courts && merged.courts.length > 0) {
    merged.court = merged.courts[0];
  }

  // Auto-enrollment logic based on gender
  let updatedDepts = [...(merged.depts || [])];
  if (merged.gender === 'Female') {
    updatedDepts = updatedDepts.filter(d => d !== 'Faithful Men Ecclessia (FaME)');
    if (!updatedDepts.includes('Glorious Vessels of Virtue (GVV)')) {
      updatedDepts.push('Glorious Vessels of Virtue (GVV)');
    }
  } else if (merged.gender === 'Male') {
    updatedDepts = updatedDepts.filter(d => d !== 'Glorious Vessels of Virtue (GVV)');
    if (!updatedDepts.includes('Faithful Men Ecclessia (FaME)')) {
      updatedDepts.push('Faithful Men Ecclessia (FaME)');
    }
  } else {
    updatedDepts = updatedDepts.filter(d => d !== 'Glorious Vessels of Virtue (GVV)' && d !== 'Faithful Men Ecclessia (FaME)');
  }
  merged.depts = updatedDepts;

  if (merged.depts && merged.depts.length > 0) {
    merged.dept = merged.depts[0];
  } else {
    merged.dept = '';
  }

  // Clean up fields to avoid potential issues (e.g. converting interests to array)
  if (merged.interests && typeof merged.interests === 'string') {
    merged.interests = merged.interests.split(',').map(i => i.trim()).filter(Boolean);
  }

  await upsertUserProfileInDb(merged);
  try {
    await syncUserChatGroups(merged);
  } catch (err) {
    console.error('Error syncing user chat groups during profile update:', err);
  }
};


export const getUserProfile = async (userId) => {
  try {
    const response = await fetchUserProfileFromDb({ uid: userId });
    return response.data?.user || {};
  } catch (error) {
    console.error('Error loading profile:', error);
    return {};
  }
};
