import { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  db,
  firebaseReady,
  onAuthStateChanged,
  doc,
  getDoc,
  reload
} from "../firebase/firebase";

import {
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  resendVerification
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!firebaseReady) {
      setAuthLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setAuthLoading(true);

      if (!fbUser) {
        setCurrentUser(null);
        setAuthLoading(false);
        return;
      }

      try {
        await reload(fbUser);

        // Block unverified users from entering the app
        if (!fbUser.emailVerified) {
          setCurrentUser(null);
          setAuthLoading(false);
          return;
        }

        const snap = await getDoc(doc(db, "users", fbUser.uid));

        if (!snap.exists()) {
          setCurrentUser(null);
          setAuthLoading(false);
          return;
        }

        setCurrentUser({
          ...snap.data(),
          uid: fbUser.uid,
          email: fbUser.email,
          emailVerified: fbUser.emailVerified
        });
      } catch (error) {
        console.error("Auth state error:", error);
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    authLoading,
    firebaseReady,

    async login(email, password) {
      const user = await loginUser(email, password);
      setCurrentUser(user);
      return user;
    },

    async register(profile) {
      const user = await registerUser(profile);

      // Do not auto-login after registration
      // User must verify email first
      setCurrentUser(null);

      return user;
    },

    async logout() {
      await logoutUser();
      setCurrentUser(null);
    },

    forgotPassword: resetPassword,
    resendVerification
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}