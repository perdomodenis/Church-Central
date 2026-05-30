import { rtdb } from './firebase';
import { ref, push, set, get, update, remove, query, orderByChild, limitToLast } from 'firebase/database';

export async function getAllEvents() {
  try {
    const eventsRef = ref(rtdb, 'events');
    const snapshot = await get(eventsRef);
    if (!snapshot.exists()) {
      return [];
    }
    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function getEventById(eventId) {
  try {
    const eventRef = ref(rtdb, `events/${eventId}`);
    const snapshot = await get(eventRef);
    if (snapshot.exists()) {
      return {
        id: eventId,
        ...snapshot.val()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export async function createEvent(eventData) {
  try {
    const eventsRef = ref(rtdb, 'events');
    const newEventRef = push(eventsRef);
    await set(newEventRef, {
      ...eventData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return {
      id: newEventRef.key,
      ...eventData,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

export async function updateEvent(eventId, updates) {
  try {
    const eventRef = ref(rtdb, `events/${eventId}`);
    await update(eventRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

export async function deleteEvent(eventId) {
  try {
    const eventRef = ref(rtdb, `events/${eventId}`);
    await remove(eventRef);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}
