
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase Client Configuration
// This is required for Client-side interactions (if any).
// Since you provided a service account (server-side), you need to get these
// values from your Firebase Console > Project Settings > General > Your apps.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "homework-project-pun-dev-v0.firebaseapp.com",
  projectId: "homework-project-pun-dev-v0",
  storageBucket: "homework-project-pun-dev-v0.firebasestorage.app",
  messagingSenderId: "1183145012710",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase for Client Side
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
