import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC_n-K9x8C-n-aVauacXvP1pQIaWg9Fjy8",
  authDomain: "my-task-manager77.firebaseapp.com",
  projectId: "my-task-manager77",
  storageBucket: "my-task-manager77.appspot.com",
  messagingSenderId: "511154049354",
  appId: "1:511154049354:android:94a0b3372708f697f5b1b3",
};

// Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);

// Ajout de la persistance avec AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export { auth };
