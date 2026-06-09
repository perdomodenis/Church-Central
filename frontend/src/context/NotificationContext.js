import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { rtdb } from '../services/firebase';
import { ref, onValue } from 'firebase/database';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [pushEnabled, setPushEnabled] = useState(() => {
        return localStorage.getItem('pushNotificationsEnabled') !== 'false';
    });
    const [hasNewInbox, setHasNewInbox] = useState(false);
    const [sessionStartTime] = useState(() => Date.now());
    const [notifiedIds, setNotifiedIds] = useState(new Set());

    // Sync notification settings with browser permission
    useEffect(() => {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                const localVal = localStorage.getItem('pushNotificationsEnabled') !== 'false';
                setPushEnabled(localVal);
            } else {
                setPushEnabled(false);
            }
        } else {
            setPushEnabled(false);
        }
    }, []);

    // Listen to Firebase RTDB inbox for the current user
    useEffect(() => {
        if (!user?.uid) {
            setNotifications([]);
            setHasNewInbox(false);
            return;
        }

        const inboxRef = ref(rtdb, `inbox/${user.uid}`);
        const unsubscribe = onValue(inboxRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list = Object.entries(data).map(([id, val]) => ({
                    id,
                    ...val
                })).sort((a, b) => b.timestamp - a.timestamp);

                setNotifications(list);

                // Check if there are any unread messages
                const hasUnread = list.some(msg => !msg.read);
                setHasNewInbox(hasUnread);

                // Trigger native browser notification for new items
                list.forEach(msg => {
                    // Trigger condition:
                    // 1. Message is unread
                    // 2. Message was created during this session (timestamp > sessionStartTime)
                    // 3. We haven't notified for this specific message ID yet
                    if (!msg.read && msg.timestamp > sessionStartTime && !notifiedIds.has(msg.id)) {
                        setNotifiedIds(prev => {
                            const next = new Set(prev);
                            next.add(msg.id);
                            return next;
                        });

                        if (pushEnabled && 'Notification' in window && Notification.permission === 'granted') {
                            try {
                                new Notification(msg.subject, {
                                    body: msg.preview || msg.body,
                                    icon: '/favicon.ico'
                                });
                            } catch (err) {
                                console.error('Error showing browser notification:', err);
                            }
                        }
                    }
                });
            } else {
                setNotifications([]);
                setHasNewInbox(false);
            }
        });

        return () => unsubscribe();
    }, [user?.uid, pushEnabled, sessionStartTime, notifiedIds]);

    const addNotification = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now();
        const notificationData = { id, message, type }; 

        setNotifications(prev => [...prev, notificationData]);

        if (duration > 0) {
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, duration);
        }

        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const togglePushNotifications = async (enabled) => {
        if (enabled) {
            if ('Notification' in window) {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    setPushEnabled(true);
                    localStorage.setItem('pushNotificationsEnabled', 'true');
                    return true;
                } else {
                    setPushEnabled(false);
                    localStorage.setItem('pushNotificationsEnabled', 'false');
                    alert('Browser notification permission was denied. Please check your browser site settings.');
                    return false;
                }
            } else {
                alert('This browser does not support notifications.');
                setPushEnabled(false);
                return false;
            }
        } else {
            setPushEnabled(false);
            localStorage.setItem('pushNotificationsEnabled', 'false');
            return true;
        }
    };

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            addNotification, 
            removeNotification, 
            pushEnabled, 
            togglePushNotifications,
            hasNewInbox 
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }   
    return context;
}