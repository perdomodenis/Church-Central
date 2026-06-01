import { rtdb } from './firebase';
import { ref, set, get, remove, child, update } from 'firebase/database';

export const createNLSEvent = async (eventData, userId, userName) => {
  try {
    const eventId = `nls_${Date.now()}`;
    const newEvent = {
      id: eventId,
      title: eventData.title || 'New Life School Class',
      date: eventData.date,
      time: eventData.time,
      location: eventData.location || 'Church Campus',
      description: eventData.description || '',
      capacity: eventData.capacity ? parseInt(eventData.capacity, 10) : 50,
      createdBy: userId,
      createdByName: userName,
      createdAt: new Date().toISOString(),
      attendees: 0
    };

    await set(ref(rtdb, `nls/events/${eventId}`), newEvent);
    return newEvent;
  } catch (error) {
    console.error('Error creating NLS event:', error);
    throw error;
  }
};

export const registerForNLS = async (eventId, userId, userName, userEmail) => {
  try {
    const registrationRef = ref(rtdb, `nls/events/${eventId}/registrations/${userId}`);
    await set(registrationRef, {
      userId,
      name: userName,
      email: userEmail,
      registeredAt: new Date().toISOString()
    });

    // Update attendees count
    const eventRef = ref(rtdb, `nls/events/${eventId}`);
    const snapshot = await get(eventRef);
    if (snapshot.exists()) {
      const event = snapshot.val();
      await update(eventRef, { attendees: (event.attendees || 0) + 1 });
    }
    return true;
  } catch (error) {
    console.error('Error registering for NLS:', error);
    throw error;
  }
};

export const unregisterFromNLS = async (eventId, userId) => {
  try {
    const registrationRef = ref(rtdb, `nls/events/${eventId}/registrations/${userId}`);
    await remove(registrationRef);

    // Update attendees count
    const eventRef = ref(rtdb, `nls/events/${eventId}`);
    const snapshot = await get(eventRef);
    if (snapshot.exists()) {
      const event = snapshot.val();
      await update(eventRef, { attendees: Math.max(0, (event.attendees || 0) - 1) });
    }
    return true;
  } catch (error) {
    console.error('Error unregistering from NLS:', error);
    throw error;
  }
};

export const checkNLSRegistration = async (eventId, userId) => {
  if (!userId) return false;
  try {
    const registrationRef = ref(rtdb, `nls/events/${eventId}/registrations/${userId}`);
    const snapshot = await get(registrationRef);
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking NLS registration:', error);
    return false;
  }
};

export const deleteNLSEvent = async (eventId) => {
  try {
    await remove(ref(rtdb, `nls/events/${eventId}`));
    return true;
  } catch (error) {
    console.error('Error deleting NLS event:', error);
    throw error;
  }
};
