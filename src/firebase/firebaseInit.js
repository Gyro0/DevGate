import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import firebaseConfig from './firebaseConfig';

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize services and export them
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

// Enable persistence for Firestore
db.enablePersistence().catch(err => {
  if (err.code == 'failed-precondition') {
    console.warn('Firestore persistence failed: Multiple tabs open?');
  } else if (err.code == 'unimplemented') {
    console.warn('Firestore persistence failed: Browser does not support.');
  } else {
    console.error('Firestore persistence error:', err);
  }
});

// Export the firebase object itself if needed elsewhere
export { firebase as default };