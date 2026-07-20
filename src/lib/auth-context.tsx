import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut as fbSignOut, type User } from "firebase/auth";
import { getFirebase, ADMIN_EMAIL } from "./firebase";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({ user: null, loading: true, isAdmin: false, signOut: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    getFirebase().then(({ auth }) => {
      unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      });
    }).catch((e) => {
      console.error("Firebase init failed", e);
      setLoading(false);
    });
    return () => unsub?.();
  }, []);

  const value: AuthCtx = {
    user,
    loading,
    isAdmin: !!user?.email && user.email.toLowerCase() === ADMIN_EMAIL,
    signOut: async () => {
      const { auth } = await getFirebase();
      await fbSignOut(auth);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
