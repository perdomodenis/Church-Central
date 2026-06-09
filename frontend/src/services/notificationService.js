import { rtdb } from './firebase';
import { ref, push, set as rtdbSet } from 'firebase/database';
import { getAllMembers } from './memberService';

/**
 * Sends a notification directly to a target user's inbox node in Realtime Database.
 * 
 * @param {string} targetUid - The Firebase UID of the user to receive the notification.
 * @param {Object} details - The notification content.
 * @param {string} details.sender - Name of the sender.
 * @param {string} details.senderId - UID of the sender (or 'system').
 * @param {string} details.subject - Subject line of the notification.
 * @param {string} details.preview - Short preview text.
 * @param {string} details.body - Complete text of the notification.
 */
export const sendInboxNotification = async (targetUid, details) => {
  if (!targetUid) {
    console.error('sendInboxNotification: targetUid is required');
    return false;
  }

  const { sender, senderId, subject, preview, body, ...metadata } = details;

  try {
    const notificationRef = ref(rtdb, `inbox/${targetUid}`);
    const newNotificationRef = push(notificationRef);
    
    // Format the date/time to match the de-CH locale standard used in the app (e.g. "14:32 9 Jun")
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' }) + ' ' + 
                          now.toLocaleDateString('de-CH', { day: 'numeric', month: 'short' });

    await rtdbSet(newNotificationRef, {
      sender: sender || 'CCI System',
      senderId: senderId || 'system',
      subject: subject || 'Notification',
      preview: preview || '',
      body: body || '',
      time: timeFormatted,
      timestamp: Date.now(),
      read: false,
      ...metadata
    });
    return true;
  } catch (error) {
    console.error('Error sending inbox notification:', error);
    return false;
  }
};


/**
 * Resolves a user's UID using their email, then sends the notification.
 * 
 * @param {string} email - The email address of the target user.
 * @param {Object} details - The notification content.
 */
export const sendInboxNotificationByEmail = async (email, details) => {
  if (!email) {
    console.error('sendInboxNotificationByEmail: email is required');
    return false;
  }

  try {
    const members = await getAllMembers();
    const matched = members.find(m => m.email?.toLowerCase() === email?.toLowerCase());
    if (matched) {
      return await sendInboxNotification(matched.uid, details);
    } else {
      console.warn(`sendInboxNotificationByEmail: No member found with email "${email}"`);
      return false;
    }
  } catch (error) {
    console.error('Error sending inbox notification by email:', error);
    return false;
  }
};
