const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const initFirebase = () => {
  // Check if already initialized
  if (admin.apps.length) {
    return admin;
  }
  
  // Check for required environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID;
  
  if (!projectId) {
    throw new Error('Missing Firebase environment variables');
  }
  
  // Initialize with environment variables
  // In production, you would typically use a service account credential file
  // For Netlify, we'll use environment variables for simplicity
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: projectId
    });
    
    console.log('Firebase Admin SDK initialized successfully');
    return admin;
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    throw error;
  }
};

/**
 * Send a Firebase notification to a specific device or topic
 * @param {string} token FCM token or topic
 * @param {object} notification Notification object with title and body
 * @param {object} data Additional data payload
 * @param {boolean} isTopic Whether the token is a topic
 * @returns {Promise<object>} FCM response
 */
const sendNotification = async (token, notification, data = {}, isTopic = false) => {
  const firebase = initFirebase();
  
  const message = {
    notification,
    data,
  };
  
  if (isTopic) {
    message.topic = token;
  } else {
    message.token = token;
  }
  
  try {
    const response = await firebase.messaging().send(message);
    return { success: true, messageId: response };
  } catch (error) {
    console.error('Error sending Firebase notification:', error);
    throw error;
  }
};

/**
 * Send a notification to multiple devices
 * @param {string[]} tokens Array of FCM tokens
 * @param {object} notification Notification object with title and body
 * @param {object} data Additional data payload
 * @returns {Promise<object>} FCM response
 */
const sendMulticastNotification = async (tokens, notification, data = {}) => {
  const firebase = initFirebase();
  
  const message = {
    tokens,
    notification,
    data,
  };
  
  try {
    const response = await firebase.messaging().sendMulticast(message);
    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    console.error('Error sending multicast Firebase notification:', error);
    throw error;
  }
};

module.exports = {
  initFirebase,
  sendNotification,
  sendMulticastNotification,
};