importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// To keep the service worker dynamic and not hardcode environment variables,
// we receive the config via URL query parameters when registering it.
const urlParams = new URLSearchParams(location.search);
const configStr = urlParams.get('config');

if (configStr) {
  try {
    const firebaseConfig = JSON.parse(decodeURIComponent(configStr));
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    // Optional: Customize background message handling here if needed.
    // By default, Firebase will display a notification with the title and body
    // from the notification payload.
    messaging.onBackgroundMessage((payload) => {
      console.log('[firebase-messaging-sw.js] Received background message ', payload);
      
      // If the payload contains a notification, we can customize its display.
      // If we don't call showNotification, the default Firebase SDK behavior handles it
      // as long as the payload has a 'notification' object.
      if (payload.notification) {
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
          body: payload.notification.body,
          icon: '/favicon.ico', // Adjust if you have a specific icon
          data: payload.data, // For handling clicks later
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
      }
    });
  } catch (error) {
    console.error('Error parsing firebase config in service worker:', error);
  }
} else {
  console.warn('No firebase config found in service worker URL.');
}
