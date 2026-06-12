import { rtdb } from './firebase';
import { ref, set, get, remove, update } from 'firebase/database';

export const getNLSConfig = async () => {
  try {
    const snapshot = await get(ref(rtdb, 'nls/config'));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error('Error getting NLS config:', error);
    throw error;
  }
};

export const updateNLSConfig = async (startDate, endDate, deadline) => {
  try {
    await set(ref(rtdb, 'nls/config'), {
      startDate,
      endDate,
      deadline,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error updating NLS config:', error);
    throw error;
  }
};

export const registerForNLS = async (userId, userData) => {
  try {
    const registrationRef = ref(rtdb, `nls/registrations/${userId}`);
    await set(registrationRef, {
      ...userData,
      registeredAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error registering for NLS:', error);
    throw error;
  }
};

export const unregisterFromNLS = async (userId) => {
  try {
    const registrationRef = ref(rtdb, `nls/registrations/${userId}`);
    await remove(registrationRef);
    return true;
  } catch (error) {
    console.error('Error unregistering from NLS:', error);
    throw error;
  }
};

export const checkNLSRegistration = async (userId) => {
  if (!userId) return false;
  try {
    const registrationRef = ref(rtdb, `nls/registrations/${userId}`);
    const snapshot = await get(registrationRef);
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking NLS registration:', error);
    return false;
  }
};

export const getNLSRegistrations = async () => {
  try {
    const snapshot = await get(ref(rtdb, 'nls/registrations'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.entries(data).map(([userId, val]) => ({
        userId,
        ...val
      })).sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
    }
    return [];
  } catch (error) {
    console.error('Error getting NLS registrations:', error);
    return [];
  }
};
