import { createContext, ReactNode, useContext, useState } from "react";

import { AuthUser } from "../../api/auth";
import { getStoredToken, setStoredToken } from "../../api/client";

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AuthUser | null>(null);

  function signIn(nextUser: AuthUser) {
    setStoredToken(nextUser.token);
    setToken(nextUser.token);
    setUser(nextUser);
  }

  function signOut() {
    setStoredToken(null);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
}
