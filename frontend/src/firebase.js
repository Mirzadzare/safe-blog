// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "safeblog-f6c4b.firebaseapp.com",
  projectId: "safeblog-f6c4b",
  storageBucket: "safeblog-f6c4b.firebasestorage.app",
  messagingSenderId: "743420816219",
  appId: "1:743420816219:web:14e91c10f0ac2d2d62087e",
  measurementId: "G-45K7CJR7FB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
