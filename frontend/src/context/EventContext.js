import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllEvents } from '../services/eventService';

const EventsContext = createContext();

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getAllEvents();
        setEvents(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <EventsContext.Provider value={{ events, loading, error }}>
      {children}
    </EventsContext.Provider>
  );
}

// Hook um die events überall in der App zu verwenden
function useEvents() {
  return useContext(EventsContext);
}
