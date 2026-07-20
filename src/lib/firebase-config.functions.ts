import { createServerFn } from "@tanstack/react-start";

export const getFirebaseConfig = createServerFn({ method: "GET" }).handler(async () => {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("Firebase API key not configured");
  return {
    apiKey,
    authDomain: "mktbt-elshaf3ey.firebaseapp.com",
    projectId: "mktbt-elshaf3ey",
    storageBucket: "mktbt-elshaf3ey.firebasestorage.app",
    messagingSenderId: "682210812882",
    appId: "1:682210812882:web:77ca2b5fb6357a706b5e0b",
  };
});
