import { 
  createBaptism as createBaptismInDb,
  listBaptisms as fetchAllBaptismsFromDb,
  registerForBaptism as registerForBaptismInDb,
  cancelBaptismRegistration as cancelBaptismRegistrationInDb,
  deleteBaptismEvent as deleteBaptismEventInDb
} from '../lib/dataconnect';

export const createBaptismEvent = async (eventData, userId, userName) => {
  try {
    const variables = {
      title: eventData.title || 'Water Baptism',
      date: eventData.date,
      time: eventData.time,
      location: eventData.location || 'Church Baptismal Pool',
      description: eventData.description || '',
      capacity: eventData.capacity ? parseInt(eventData.capacity, 10) : 100,
      createdByUid: userId
    };

    const response = await createBaptismInDb(variables);
    
    return {
      id: response.data?.baptismEvent_insert?.id,
      title: variables.title,
      date: variables.date,
      time: variables.time,
      location: variables.location,
      description: variables.description,
      createdBy: userId,
      createdByName: userName,
      createdAt: new Date().toISOString(),
      attendees: 0
    };
  } catch (error) {
    console.error('Error creating baptism event:', error);
    throw error;
  }
};

export const getAllBaptismEvents = async () => {
  try {
    const response = await fetchAllBaptismsFromDb();
    const events = response.data?.baptismEvents || [];

    const mapped = events.map(e => ({
      id: e.id,
      title: e.title,
      date: e.date,
      time: e.time,
      location: e.location,
      description: e.description,
      createdBy: e.createdBy?.uid || 'unknown',
      createdByName: e.createdBy ? `${e.createdBy.first} ${e.createdBy.last}` : 'Unknown',
      createdAt: e.createdAt,
      attendees: Math.max(0, e.registeredCount || 0),
      attendeesList: (e.baptismRegistrations_on_baptismEvent || []).map(reg => ({
        userId: reg.user.uid,
        name: `${reg.user.first} ${reg.user.last}`,
        email: reg.user.email,
        profilePhoto: reg.user.profilePhoto
      }))
    }));

    return mapped.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  } catch (error) {
    console.error('Error fetching baptism events:', error);
    return [];
  }
};

export const registerForBaptism = async (eventId, userId, userName, userEmail) => {
  try {
    await registerForBaptismInDb({
      baptismEventId: eventId,
      userUid: userId
    });
    return true;
  } catch (error) {
    console.error('Error registering for baptism:', error);
    throw error;
  }
};

export const unregisterFromBaptism = async (eventId, userId) => {
  try {
    await cancelBaptismRegistrationInDb({
      baptismEventId: eventId,
      userUid: userId
    });
    return true;
  } catch (error) {
    console.error('Error unregistering from baptism:', error);
    throw error;
  }
};

export const checkBaptismRegistration = async (eventId, userId) => {
  try {
    const events = await getAllBaptismEvents();
    const event = events.find(e => e.id === eventId);
    return event ? event.attendeesList.some(a => a.userId === userId) : false;
  } catch (error) {
    console.error('Error checking registration:', error);
    return false;
  }
};

export const getBaptismEventAttendees = async (eventId) => {
  try {
    const events = await getAllBaptismEvents();
    const event = events.find(e => e.id === eventId);
    return event ? event.attendeesList : [];
  } catch (error) {
    console.error('Error fetching attendees:', error);
    return [];
  }
};

export const deleteBaptismEvent = async (eventId) => {
  try {
    await deleteBaptismEventInDb({ id: eventId });
    return true;
  } catch (error) {
    console.error('Error deleting baptism event:', error);
    throw error;
  }
};
