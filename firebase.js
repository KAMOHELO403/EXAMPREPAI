import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBw93X1WVtW95s2Sx5yqluWWRqO3Zg_y04",
  authDomain: "examprepai-8db41.firebaseapp.com",
  projectId: "examprepai-8db41",
  storageBucket: "examprepai-8db41.firebasestorage.app",
  messagingSenderId: "102205308525",
  appId: "1:102205308525:web:8e49533c2f04cc60a20964"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
