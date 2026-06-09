import { storage } from './firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  getUserProfile as fetchUserProfileFromDb,
  upsertUserProfile as upsertUserProfileInDb
} from '../lib/dataconnect';

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
    dept: currentProfile.dept || data.dept || '',
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
    ...data
  };

  // Clean up fields to avoid potential issues (e.g. converting interests to array)
  if (merged.interests && typeof merged.interests === 'string') {
    merged.interests = merged.interests.split(',').map(i => i.trim()).filter(Boolean);
  }

  await upsertUserProfileInDb(merged);
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
