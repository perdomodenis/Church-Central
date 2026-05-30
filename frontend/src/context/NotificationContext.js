import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    //Notifikation setzen
    const addNotification = useCallback((message, type = 'info') => {
        const id = Date.now();
        const notificationData = { id, message, type }; 

        setNotifications(prev => [...prev, notificationData]);

        //Automatisches Entfernen der Notifikation nach 5 Sekunden
        if (duration > 0) {
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, duration);
        }

        return id;
    }, []);

    //entfernt eine Notifikation
    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ notification, addNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}

//Hook zum Zugriff auf die Notifikationen
export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }   
    return context;
}