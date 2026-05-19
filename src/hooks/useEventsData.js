import {useState, useCallback} from 'react';
import {
    createEvent,
    updateevent as updateEventService,
    deleteEvent as deleteEventService,
}from '../services/eventService';

export function useEventsData() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //Kreiert ein Event
    const create = useCallback(async (eventData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await createEvent(eventData);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        }finally {
            setLoading(false);
        }
    }, []);

    //Aktualisiert ein Event
    const update = useCallback (async (eventId, updates) => {
        setLoading(true);
        setError(null); 
        try {
            await updateEventService(eventId, updates);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    //Löscht ein Event
    const deleteEvent = useCallback(async (eventId) => {
        setLoading(true);
        setError(null);
        try {
            await deleteEventService(eventId);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        isLoading: loading,
        error,
        create,
        update,
        deleteEvent,    
    };
}