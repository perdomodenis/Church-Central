import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { rtdb, messaging } from '../services/firebase';
import { ref, onValue } from 'firebase/database';
import { getToken, onMessage, isSupported } from 'firebase/messaging';
import { saveFcmToken, removeFcmToken } from '../services/notificationService';

const NotificationContext = createContext();

const INITIAL_PUSH_ENABLED = localStorage.getItem('pushNotificationsEnabled') !== 'false';

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [pushEnabled, setPushEnabled] = useState(() => INITIAL_PUSH_ENABLED);
    const [hasNewInbox, setHasNewInbox] = useState(false);
    const [sessionStartTime] = useState(() => Date.now());
    const [notifiedIds, setNotifiedIds] = useState(new Set());
    const [hasNewMessages, setHasNewMessages] = useState(false);

    // Sync notification settings with browser permission
    useEffect(() => {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                setPushEnabled(INITIAL_PUSH_ENABLED);
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

    // Listen to Firebase RTDB for new chat messages
    useEffect(() => {
        if (!user?.uid) {
            setHasNewMessages(false);
            return;
        }

        const checkMessages = (data, isGroup) => {
            if (!data) return false;
            
            const readStatuses = JSON.parse(localStorage.getItem('chatReadStatuses') || '{}');
            return Object.entries(data).some(([chatId, chat]) => {
                const members = isGroup ? chat.members : chat.participants;
                if (members?.includes(user.uid)) {
                    const lastMsg = chat.lastMessage;
                    if (lastMsg && lastMsg.userId !== user.uid) { // Use userId instead of senderId as defined in chatService
                        const msgTime = new Date(lastMsg.timestamp).getTime();
                        const lastRead = readStatuses[chatId] || 0;
                        if (msgTime > lastRead) {
                            return true;
                        }
                    }
                }
                return false;
            });
        };

        let groupsData = null;
        let chatsData = null;

        const evaluateMessages = () => {
            const hasUnreadGroups = checkMessages(groupsData, true);
            const hasUnreadChats = checkMessages(chatsData, false);
            setHasNewMessages(hasUnreadGroups || hasUnreadChats);
        };

        const groupsRef = ref(rtdb, 'groups');
        const chatsRef = ref(rtdb, 'chats');

        const unsubscribeGroups = onValue(groupsRef, (snapshot) => {
            groupsData = snapshot.val();
            evaluateMessages();
        });

        const unsubscribeChats = onValue(chatsRef, (snapshot) => {
            chatsData = snapshot.val();
            evaluateMessages();
        });

        window.addEventListener('chatReadStatusesUpdated', evaluateMessages);

        return () => {
            unsubscribeGroups();
            unsubscribeChats();
            window.removeEventListener('chatReadStatusesUpdated', evaluateMessages);
        };
    }, [user?.uid]);



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

    // Handle incoming FCM foreground messages
    useEffect(() => {
        const setupForegroundMessaging = async () => {
            try {
                const supported = await isSupported();
                if (supported && messaging) {
                    const unsubscribe = onMessage(messaging, (payload) => {
                        console.log('Received foreground message:', payload);
                        if (payload.notification) {
                            addNotification(
                                `${payload.notification.title}: ${payload.notification.body}`,
                                'info',
                                8000
                            );
                        }
                    });
                    return unsubscribe;
                }
            } catch (err) {
                console.error('Error setting up foreground messaging:', err);
            }
        };
        let unsub = null;
        setupForegroundMessaging().then(u => { unsub = u; });
        return () => {
            if (typeof unsub === 'function') unsub();
        };
    }, [addNotification]);

    const togglePushNotifications = async (enabled) => {
        if (enabled) {
            if ('Notification' in window) {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    setPushEnabled(true);
                    localStorage.setItem('pushNotificationsEnabled', 'true');
                    
                    try {
                        const supported = await isSupported();
                        if (supported && messaging) {
                            const configObj = {
                                apiKey: process.env.REACT_APP_FIREBASE_PUBLISHABLE_API_KEY,
                                authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
                                projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
                                storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
                                messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
                                appId: process.env.REACT_APP_FIREBASE_APP_ID,
                            };
                            const swUrl = `/firebase-messaging-sw.js?config=${encodeURIComponent(JSON.stringify(configObj))}`;
                            const registration = await navigator.serviceWorker.register(swUrl);
                            
                            const token = await getToken(messaging, {
                                vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
                                serviceWorkerRegistration: registration
                            });
                            
                            if (token && user?.uid) {
                                await saveFcmToken(user.uid, token);
                            }
                        }
                    } catch (err) {
                        console.error('Failed to get FCM token:', err);
                    }

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
            hasNewInbox,
            hasNewMessages,
            setHasNewMessages
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