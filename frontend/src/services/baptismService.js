import { rtdb } from './firebase';
import { ref, push, set, get, update, remove, query, orderByChild } from 'firebase/database';

export const createBaptismEvent = async (eventData, userId, userName) => {
  try {
    const eventsRef = ref(rtdb, 'baptisms/events');
    const newEventRef = push(eventsRef);

    const event = {
      title: eventData.title || 'Water Baptism',
      date: eventData.date,
      time: eventData.time,
      location: eventData.location || 'Church Baptismal Pool',
      description: eventData.description || '',
      createdBy: userId,
      createdByName: userName,
      createdAt: new Date().toISOString(),
      attendees: 0
    };

    await set(newEventRef, event);
    return { id: newEventRef.key, ...event };
  } catch (error) {
    console.error('Error creating baptism event:', error);
    throw error;
  }
};

export const getAllBaptismEvents = async () => {
  try {
    const eventsRef = ref(rtdb, 'baptisms/events');
    const snapshot = await get(eventsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const events = [];
    snapshot.forEach((childSnapshot) => {
      events.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    return events.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  } catch (error) {
    console.error('Error fetching baptism events:', error);
    return [];
  }
};

export const registerForBaptism = async (eventId, userId, userName, userEmail) => {
  try {
    const registrationRef = ref(rtdb, `baptisms/registrations/${eventId}/${userId}`);
    
    await set(registrationRef, {
      name: userName,
      email: userEmail,
      registeredAt: new Date().toISOString(),
      status: 'registered'
    });

    await updateBaptismEventAttendees(eventId, 1);
    
    return true;
  } catch (error) {
    console.error('Error registering for baptism:', error);
    throw error;
  }
};

export const unregisterFromBaptism = async (eventId, userId) => {
  try {
    const registrationRef = ref(rtdb, `baptisms/registrations/${eventId}/${userId}`);
    
    await remove(registrationRef);
    await updateBaptismEventAttendees(eventId, -1);
    
    return true;
  } catch (error) {
    console.error('Error unregistering from baptism:', error);
    throw error;
  }
};

const updateBaptismEventAttendees = async (eventId, change) => {
  try {
    const eventRef = ref(rtdb, `baptisms/events/${eventId}`);
    const snapshot = await get(eventRef);
    
    if (snapshot.exists()) {
      const currentAttendees = snapshot.val().attendees || 0;
      await update(eventRef, {
        attendees: Math.max(0, currentAttendees + change)
      });
    }
  } catch (error) {
    console.error('Error updating attendees:', error);
  }
};

export const checkBaptismRegistration = async (eventId, userId) => {
  try {
    const registrationRef = ref(rtdb, `baptisms/registrations/${eventId}/${userId}`);
    const snapshot = await get(registrationRef);
    
    return !!snapshot.val();
  } catch (error) {
    console.error('Error checking registration:', error);
    return false;
  }
};

export const getBaptismEventAttendees = async (eventId) => {
  try {
    const attendeesRef = ref(rtdb, `baptisms/registrations/${eventId}`);
    const snapshot = await get(attendeesRef);

    if (!snapshot.exists()) {
      return [];
    }

    const attendees = [];
    snapshot.forEach((childSnapshot) => {
      attendees.push({
        userId: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    return attendees;
  } catch (error) {
    console.error('Error fetching attendees:', error);
    return [];
  }
};

export const deleteBaptismEvent = async (eventId) => {
  try {
    const eventRef = ref(rtdb, `baptisms/events/${eventId}`);
    const registrationsRef = ref(rtdb, `baptisms/registrations/${eventId}`);
    
    await remove(eventRef);
    await remove(registrationsRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting baptism event:', error);
    throw error;
  }
};
