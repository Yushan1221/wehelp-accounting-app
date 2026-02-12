import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase Console 
const firebaseConfig = {
  apiKey: "AIzaSyBMGdRIpcRD9dq3jZ_edHQTbV0mhPLdVMU",
  authDomain: "wehelp-accounting-app.firebaseapp.com",
  projectId: "wehelp-accounting-app",
  storageBucket: "wehelp-accounting-app.firebasestorage.app",
  messagingSenderId: "15319281742",
  appId: "1:15319281742:web:4390ba8053fa24e163d31f",
  measurementId: "G-980KZJ2Y0H"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 匯出會用到的服務
export const auth = getAuth(app);
export const db = getFirestore(app);