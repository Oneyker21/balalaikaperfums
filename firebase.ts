import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// We are skipping Storage as requested to use Base64 strings

const firebaseConfig = {
  apiKey: "AIzaSyBefAS9iH015YpdrCFknu-FYuCvojrnmcc",
  authDomain: "balalaikasperfum.firebaseapp.com",
  projectId: "balalaikasperfum",
  storageBucket: "balalaikasperfum.firebasestorage.app",
  messagingSenderId: "506856835374",
  appId: "1:506856835374:web:944a0045c7684bbd3dd2bf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);