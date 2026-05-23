// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJ0ciJj7kG0PsOKutDLfWkdjpTiPc2PN0",
  authDomain: "nishar-apps.firebaseapp.com",
  projectId: "nishar-apps",
  storageBucket: "nishar-apps.firebasestorage.app",
  messagingSenderId: "583593686084",
  appId: "1:583593686084:web:aa0035bd6c39e0c7117811",
  measurementId: "G-1GPN49JY4S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
