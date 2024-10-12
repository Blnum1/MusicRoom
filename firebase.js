import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // สำหรับการเก็บข้อมูล
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbMY99C-WlWulAhEfp2nN2VzYo2L-5Tmc",
  authDomain: "reactna-bdde6.firebaseapp.com",
  databaseURL: "https://reactna-bdde6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "reactna-bdde6",
  storageBucket: "reactna-bdde6.appspot.com",
  messagingSenderId: "575880627115",
  appId: "1:575880627115:web:09b1d41b24b80a1ccf48ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
const db = getFirestore(app);

export { auth, db };