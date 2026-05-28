import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { 
  getAuth, 
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase config (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCgRp_9rO47iBxMxBZGE9xMaJUf1E11YrE",
  authDomain: "church-central-992a7.firebaseapp.com",
  databaseURL: "https://church-central-992a7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "church-central-992a7",
  storageBucket: "church-central-992a7.firebasestorage.app",
  messagingSenderId: "403018052718",
  appId: "1:403018052718:web:a7ceedee1c6416bed0627f",
  measurementId: "G-XWPXLKM790"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export auth functions
export { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword };
