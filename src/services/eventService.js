import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from './firebase';

// Get all events
export async function getAllEvents() {
  try {
    const eventsCollection = collection(db, 'events');
    const snapshot = await getDocs(eventsCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

// Get single event by ID
export async function getEventById(eventId) {
  try {
    const eventDoc = doc(db, 'events', eventId);
    const snapshot = await getDoc(eventDoc);
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
}

// Create new event
export async function createEvent(eventData) {
  try {
    const eventsCollection = collection(db, 'events');
    const docRef = await addDoc(eventsCollection, {
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return {
      id: docRef.id,
      ...eventData
    };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

// Update event
export async function updateEvent(eventId, updates) {
  try {
    const eventDoc = doc(db, 'events', eventId);
    await updateDoc(eventDoc, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
}

// Delete event
export async function deleteEvent(eventId) {
  try {
    const eventDoc = doc(db, 'events', eventId);
    await deleteDoc(eventDoc);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

// Register user for event
export async function registerForEvent(eventId, userId) {
  try {
    const eventDoc = doc(db, 'events', eventId);
    const event = await getEventById(eventId);
    
    const registrations = event.registrations || [];
    if (!registrations.includes(userId)) {
      registrations.push(userId);
    }

    await updateDoc(eventDoc, { registrations });
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
}