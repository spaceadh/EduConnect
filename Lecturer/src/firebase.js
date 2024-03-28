import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCI6x7mYuB7JPaXaqgIhCLj3mNCzPElOXY",
  authDomain: "kcauschoolproject.firebaseapp.com",
  databaseURL: "https://kcauschoolproject-default-rtdb.firebaseio.com",
  projectId: "kcauschoolproject",
  storageBucket: "kcauschoolproject.appspot.com",
  messagingSenderId: "312803926607",
  appId: "1:312803926607:web:eca9db45f75dca2937803a",
  measurementId: "G-JY32HRH8BX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, app,storage };  // Export the 'app' object for reference if needed