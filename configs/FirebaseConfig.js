// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAP_KZONfNrv3qGeF80jzzRzRoAhPFE6ds",
  authDomain: "ai-travel-planner-2fc7a.firebaseapp.com",
  projectId: "ai-travel-planner-2fc7a",
  storageBucket: "ai-travel-planner-2fc7a.firebasestorage.app",
  messagingSenderId: "227402807307",
  appId: "1:227402807307:web:743c89259b8051e2042f0e",
  measurementId: "G-P04WYG01QW",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

//AIzaSyBUCR7DNcHVDUg_9M6lMCnQarDAxbp9mA4
