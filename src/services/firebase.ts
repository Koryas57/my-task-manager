import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  setPersistence,
  browserLocalPersistence,
  getReactNativePersistence,
  Auth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";

// ✅ Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC_n-K9x8C-n-aVauacXvP1pQIaWg9Fjy8",
  authDomain: "my-task-manager77.firebaseapp.com",
  projectId: "my-task-manager77",
  storageBucket: "my-task-manager77.appspot.com",
  messagingSenderId: "511154049354",
  appId: "1:511154049354:android:94a0b3372708f697f5b1b3",
};

// ✅ Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Gestion de la persistance selon la plateforme
let auth: Auth;
if (typeof window !== "undefined") {
  // 🔥 Persistance sur Web avec localStorage
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence)
    .then(() => console.log("✅ Persistance activée pour Web"))
    .catch((err) => console.error("❌ Erreur persistance Web :", err));
} else {
  // 🔥 Persistance sur Mobile avec AsyncStorage
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  console.log("✅ Persistance activée pour Mobile");
}

// ✅ Finaliser session Google
WebBrowser.maybeCompleteAuthSession();

export { auth, db };
