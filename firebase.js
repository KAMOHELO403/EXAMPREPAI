import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQJDo6KsPtinXd525Hv4MIg7YbnJBi204",
  authDomain: "examprepai-8db41.firebaseapp.com",
  projectId: "examprepai-8db41",
  storageBucket: "examprepai-8db41.firebasestorage.app",
  messagingSenderId: "102205308525",
  appId: "1:102205308525:web:8e49533c2f04cc60a20964"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);