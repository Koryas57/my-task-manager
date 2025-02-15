import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  inMemoryPersistence,
  Auth,
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import Constants from "expo-constants";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC_n-K9x8C-n-aVauacXvP1pQIaWg9Fjy8",
  authDomain: "my-task-manager77.firebaseapp.com",
  projectId: "my-task-manager77",
  storageBucket: "my-task-manager77.appspot.com",
  messagingSenderId: "511154049354",
  appId: "1:511154049354:android:94a0b3372708f697f5b1b3",
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Fixer l'erreur de `getReactNativePersistence`
let auth: Auth;
if (typeof window !== "undefined") {
  // 👉 Web : Utilisation de `inMemoryPersistence`
  auth = getAuth(app);
  auth.setPersistence(inMemoryPersistence);
} else {
  // 👉 Mobile : Utilisation de `getReactNativePersistence`
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Permet de garder la connexion active
WebBrowser.maybeCompleteAuthSession();

const provider = new GoogleAuthProvider();

// ✅ Fonction de connexion Google
export const signInWithGoogle = async (idToken: string) => {
  try {
    console.log("📡 Envoi du Token à Firebase :", idToken); // 🔍 DEBUG
    const [request, response, promptAsync] = Google.useAuthRequest({
      clientId: Constants.expoConfig?.extra?.googleClientIdWeb, // Utilise l'ID Web sur navigateur
      androidClientId: Constants.expoConfig?.extra?.googleClientIdAndroid,
      redirectUri: Constants.expoConfig?.extra?.redirectUri,
      scopes: ["profile", "email"], // 🔥 Ajout des permissions
    });

    if (response?.type === "success" && response.authentication?.idToken) {
      const { idToken } = response.authentication;
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      console.log("Données Firebase de l'utilisateur :", userCredential.user); // 🔍 DEBUG
      return userCredential.user;
    }
  } catch (error) {
    console.error("Erreur de connexion :", error);
  }
  return null;
};

// ✅ Fonction de déconnexion
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
  }
};

export { auth, db };
