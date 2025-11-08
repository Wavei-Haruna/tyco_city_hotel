// lib/firebase.js or firebase/config.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAcVYl8QUHk9cxVuRGpWfa20Q4Keidzwis",
  authDomain: "leadhero-f9780.firebaseapp.com",
  projectId: "leadhero-f9780",
  storageBucket: "leadhero-f9780.firebasestorage.app",
  messagingSenderId: "825479317918",
  appId: "1:825479317918:web:ce5580859e3fd364c8ae8f"
};

// Initialize Firebase (prevent multiple instances)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only on client side
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };
export default app;