import { rtdb } from './firebase';
import { ref, push, set, get, update, remove } from 'firebase/database';

export const addEvent = async (eventData, userId) => {
  try {
    const eventsRef = ref(rtdb, 'events');
    const newEventRef = push(eventsRef);

    const event = {
      title: eventData.title,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      location: eventData.location || '',
      description: eventData.description || '',
      category: eventData.category || 'Event',
      createdBy: userId,
      createdByName: eventData.createdByName || 'Unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await set(newEventRef, event);
    return { id: newEventRef.key, ...event };
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};

export const getAllEvents = async () => {
  try {
    const eventsRef = ref(rtdb, 'events');
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

    return events.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const eventRef = ref(rtdb, `events/${eventId}`);

    const updatedData = {
      ...eventData,
      updatedAt: new Date().toISOString()
    };

    await update(eventRef, updatedData);
    return { id: eventId, ...updatedData };
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const eventRef = ref(rtdb, `events/${eventId}`);
    await remove(eventRef);
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

export const getEventsByUser = async (userId) => {
  try {
    const eventsRef = ref(rtdb, 'events');
    const snapshot = await get(eventsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const events = [];
    snapshot.forEach((childSnapshot) => {
      const event = childSnapshot.val();
      if (event.createdBy === userId) {
        events.push({
          id: childSnapshot.key,
          ...event
        });
      }
    });

    return events;
  } catch (error) {
    console.error('Error fetching user events:', error);
    return [];
  }
};

export const extractCategory = (title) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('worship') || lowerTitle.includes('service')) return 'Worship';
  if (lowerTitle.includes('youth')) return 'Youth';
  if (lowerTitle.includes('bible') || lowerTitle.includes('study')) return 'Study';
  if (lowerTitle.includes('community') || lowerTitle.includes('outreach')) return 'Community';
  if (lowerTitle.includes('baptism')) return 'Baptism';
  return 'Event';
};
