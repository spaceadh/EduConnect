// firebase.js
import admin from 'firebase-admin';
import 'dotenv/config';

// Initialize Firebase Admin SDK
import serviceAccount from './serviceAccountKey.json' assert { type: "json" };
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kcauschoolproject-default-rtdb.firebaseio.com"
});

// Export Firebase Realtime Database reference
export const firebaseDatabase = admin.database();

// Get Firebase Auth instance
const auth = admin.auth();

// // Listen for changes in user authentication state
// auth.onAuthStateChanged(async (user) => {
//   if (user) {
//     // Check if the user's email is verified
//     if (user.emailVerified) {
//       // Get the user's ID
//       const userId = user.uid;

//       // Update the corresponding field in Realtime Database
//       try {
//         await firebaseDatabase.ref(`students/${userId}/emailVerified`).set(true);
//       } catch (error) {
//         console.error('Error updating emailVerified status in Realtime Database:', error);
//       }
//     }
//   }
// });