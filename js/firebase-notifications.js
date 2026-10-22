import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging.js";
import { firebaseConfig } from './firebase-config.js';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging.js";
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission and get token
export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY' });
      console.log('Token de notification:', token);
      // Send token to server to save for push notifications
      return token;
    } else {
      console.log('Permission de notification refusée');
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la demande de permission de notification:', error);
    return null;
  }
}

// Handle incoming messages
export function onMessageListener(callback) {
  onMessage(messaging, (payload) => {
    console.log('Message reçu:', payload);
    callback(payload);
  });
}
