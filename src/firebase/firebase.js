import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA28D9w6fa67SguSWBmeZZQ8oykpVITHa8",
  authDomain: "sdcvibe-663bd.firebaseapp.com",
  projectId: "sdcvibe-663bd",
  storageBucket: "sdcvibe-663bd.firebasestorage.app",
  messagingSenderId: "913635723931",
  appId: "1:913635723931:web:484852a5253dc33231d43e",
  measurementId: "G-HHYKCSB8DM"
};

const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

try {
  getAnalytics(app);
} catch (err) {
  // analytics won't work in localhost sometimes; safe to ignore
}

