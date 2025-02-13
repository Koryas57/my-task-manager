import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC_n-K9x8C-n-aVauacXvP1pQIaWg9Fjy8",
  authDomain: "my-task-manager77.firebaseapp.com",
  projectId: "my-task-manager77",
  storageBucket: "my-task-manager77.appspot.com",
  messagingSenderId: "511154049354",
  appId: "1:511154049354:android:94a0b3372708f697f5b1b3",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
