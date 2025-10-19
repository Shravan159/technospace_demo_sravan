// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCom2aTnD7qyr39NmHtozv19k_M8ITpjgI",
  authDomain: "frontend-withbackend.firebaseapp.com",
  projectId: "frontend-withbackend",
  storageBucket: "frontend-withbackend.firebasestorage.app",
  messagingSenderId: "767017769325",
  appId: "1:767017769325:web:e2cb8112ecce2e42d4e264",
  measurementId: "G-2MP07ZY7QY"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);