import { 
  createEvent as createEventInDb,
  listEvents as fetchAllEventsFromDb,
  updateEvent as updateEventInDb,
  deleteEvent as deleteEventInDb,
  createAnnouncement,
  registerForEvent as registerForEventInDb,
  cancelEventRegistration as cancelEventRegistrationInDb
} from '../lib/dataconnect';

export const addEvent = async (eventData, userId) => {
  try {
    let date = '';
    let time = '';
    let endTime = '';

    if (eventData.startTime) {
      date = eventData.startTime.split('T')[0];
      time = eventData.startTime.split('T')[1] || '00:00';
      endTime = eventData.endTime ? eventData.endTime.split('T')[1] || '23:59' : '23:59';
    } else {
      date = eventData.date || new Date().toISOString().split('T')[0];
      time = eventData.time || '00:00';
      endTime = eventData.endTime || '23:59';
    }

    const variables = {
      title: eventData.title,
      date,
      time,
      endTime,
      location: eventData.location || '',
      description: eventData.description || '',
      type: eventData.category || 'Event',
      capacity: eventData.capacity ? parseInt(eventData.capacity, 10) : 100,
      createdByUid: userId
    };

    const response = await createEventInDb(variables);

    // Auto-upload event to news feed
    try {
      const dateParts = date.split('-');
      let formattedDate = date;
      if (dateParts.length === 3) {
        const d = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      const postContent = `📅 **New Event: ${variables.title}**\n\n📍 Location: ${variables.location}\n🕒 Time: ${formattedDate} at ${variables.time}\n\n${variables.description}`;
      
      await createAnnouncement({
        content: postContent,
        scope: 'News',
        category: 'Announcement',
        imageUrl: '',
        authorUid: userId
      });
    } catch (announcementError) {
      console.error('Failed to auto-create news feed post for event:', announcementError);
    }
    
    // Construct return value compatible with old structure
    return {
      id: response.data?.event_insert?.id,
      title: variables.title,
      date,
      time,
      startTime: `${date}T${time}`,
      endTime: `${date}T${endTime}`,
      location: variables.location,
      description: variables.description,
      category: variables.type,
      createdBy: userId,
      createdByName: eventData.createdByName || 'Creator',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};

export const getAllEvents = async () => {
  try {
    const response = await fetchAllEventsFromDb({ fetchPolicy: 'SERVER_ONLY' });
    const events = response.data?.events || [];

    // Map database result to frontend compatible object
    const mapped = events.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date,
      time: event.time,
      startTime: `${event.date}T${event.time}`,
      endTime: `${event.date}T${event.endTime}`,
      location: event.location,
      description: event.description,
      category: event.type,
      createdBy: event.createdBy?.uid || 'unknown',
      createdByName: event.createdBy ? `${event.createdBy.first} ${event.createdBy.last}` : 'Unknown',
      createdAt: event.createdAt,
      updatedAt: event.createdAt, // Fallback
      registered: Math.max(0, event.registered || 0),
      attendeeUids: event.eventRegistrations_on_event ? event.eventRegistrations_on_event.map(r => r.user.uid) : [],
      attendees: event.eventRegistrations_on_event ? event.eventRegistrations_on_event.map(r => `${r.user.first || ''} ${r.user.last || ''}`.trim()) : [],
      userId: event.createdBy?.uid || 'unknown'
    }));

    return mapped.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    let date = eventData.date;
    let time = eventData.time;
    let endTime = eventData.endTime;

    if (eventData.startTime) {
      date = eventData.startTime.split('T')[0];
      time = eventData.startTime.split('T')[1];
      endTime = eventData.endTime ? eventData.endTime.split('T')[1] : undefined;
    }

    const variables = {
      id: eventId,
      title: eventData.title,
      date,
      time,
      endTime,
      location: eventData.location,
      description: eventData.description,
      type: eventData.category,
      capacity: eventData.capacity ? parseInt(eventData.capacity, 10) : undefined
    };

    // Clean up undefined parameters
    Object.keys(variables).forEach(key => {
      if (variables[key] === undefined) {
        delete variables[key];
      }
    });

    await updateEventInDb(variables);
    
    return {
      id: eventId,
      ...eventData,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    await deleteEventInDb({ id: eventId });
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

export const getEventsByUser = async (userId) => {
  try {
    const allEvents = await getAllEvents();
    return allEvents.filter(event => event.createdBy === userId);
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
  if (lowerTitle.includes('community') || lowerTitle.includes('outreach')) return 'Outreach';
  if (lowerTitle.includes('baptism')) return 'Baptism';
  return 'Event';
};

export const registerForEvent = async (eventId, userUid) => {
  try {
    await registerForEventInDb({ eventId, userUid });
    return true;
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
};

export const cancelEventRegistration = async (eventId, userUid) => {
  try {
    await cancelEventRegistrationInDb({ eventId, userUid });
    return true;
  } catch (error) {
    console.error('Error cancelling event registration:', error);
    throw error;
  }
};
