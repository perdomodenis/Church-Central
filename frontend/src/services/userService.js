import { rtdb, storage } from './firebase';
import { ref, set, get, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export const updateProfilePhoto = async (userId, file) => {
  const photoRef = storageRef(storage, `users/${userId}/profile-photo`);
  await uploadBytes(photoRef, file);
  const url = await getDownloadURL(photoRef);
  await update(ref(rtdb, `users/${userId}`), { profilePhoto: url });
  return url;
};

export const updateUserProfile = async (userId, data) => {
  await update(ref(rtdb, `users/${userId}`), data);
};

export const getUserProfile = async (userId) => {
  try {
    const snapshot = await get(ref(rtdb, `users/${userId}`));
    return snapshot.val() || {};
  } catch (error) {
    console.error('Error loading profile:', error);
    return {};
  }
};
