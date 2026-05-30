// Google Calendar API service
// Uses public Google Calendar API (no authentication needed)

const API_KEY = process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY;
const CALENDAR_ID = process.env.REACT_APP_GOOGLE_CALENDAR_ID;

export const getCalendarEvents = async () => {
  // If not configured, return null to signal using mock data
  if (!API_KEY || !CALENDAR_ID) {
    return null;
  }

  try {
    const now = new Date().toISOString();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // Get events for next 3 months
    const maxDateISO = maxDate.toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${now}&timeMax=${maxDateISO}&maxResults=20&orderBy=startTime&singleEvents=true`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error('Error fetching calendar events:', response.statusText);
      return null;
    }

    const data = await response.json();

    // Transform Google Calendar events to our format
    return (data.items || []).map((event) => ({
      id: event.id,
      title: event.summary || 'Untitled Event',
      startTime: event.start?.dateTime || event.start?.date,
      endTime: event.end?.dateTime || event.end?.date,
      description: event.description || '',
      location: event.location || '',
      category: extractCategory(event.summary || ''),
      googleCalendarLink: event.htmlLink
    }));
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return null;
  }
};

export const extractCategory = (title) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('worship') || lowerTitle.includes('service')) return 'Worship';
  if (lowerTitle.includes('youth')) return 'Youth';
  if (lowerTitle.includes('bible') || lowerTitle.includes('study')) return 'Study';
  if (lowerTitle.includes('community') || lowerTitle.includes('outreach')) return 'Community';
  return 'Event';
};

export const formatEventDate = (dateString) => {
  if (!dateString) {
    return { day: 'TBD', date: '-', month: 'TBD' };
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return { day: 'TBD', date: '-', month: 'TBD' };
  }

  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 3),
    date: date.getDate(),
    month: date.toLocaleDateString('en-US', { month: 'short' })
  };
};

export const formatEventTime = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return 'TBD';
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'TBD';
  }

  // Check if it's an all-day event
  if (typeof startTime === 'string' && startTime.length === 10) {
    return 'All Day';
  }

  const startTimeStr = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const endTimeStr = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return `${startTimeStr} - ${endTimeStr}`;
};

export const getCalendarUrl = () => {
  if (!CALENDAR_ID) return null;
  return `https://calendar.google.com/calendar/u/0?cid=${CALENDAR_ID}`;
};
