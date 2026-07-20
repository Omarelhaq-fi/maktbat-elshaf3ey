import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseConfig } from "./firebase-config.functions";

export const ADMIN_EMAIL = "admin@gmail.com";

let appPromise: Promise<{ app: FirebaseApp; auth: Auth; db: Firestore }> | null = null;

export function getFirebase() {
  if (!appPromise) {
    appPromise = (async () => {
      const config = await getFirebaseConfig();
      const app = getApps()[0] ?? initializeApp(config);
      return { app, auth: getAuth(app), db: getFirestore(app) };
    })();
  }
  return appPromise;
}
