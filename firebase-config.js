import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCop9FnqrMS7zDmBruG1IH9S-EZhc6sexk",
  authDomain: "mangotango-mobile.firebaseapp.com",
  databaseURL: "https://mangotango-mobile-default-rtdb.firebaseio.com",
  projectId: "mangotango-mobile",
  storageBucket: "mangotango-mobile.appspot.com",
  messagingSenderId: "85435573414",
  appId: "1:85435573414:web:37fb969be0df109a974067",
  measurementId: "G-E2TX3PEMFY"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);