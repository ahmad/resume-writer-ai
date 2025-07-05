import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA7U3EhqcMDVKKxH8LchWmOhu_w2yTVItk",
  authDomain: "resume-writer-ffd1d.firebaseapp.com",
  projectId: "resume-writer-ffd1d",
  storageBucket: "resume-writer-ffd1d.firebasestorage.app",
  messagingSenderId: "1018155935511",
  appId: "1:1018155935511:web:8a6290afdd86c7d19ef952",
  measurementId: "G-FYW63YHZYY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app; 