import React, { useState, useEffect, createContext } from "react";
import { setToken, getToken, removeToken } from "../api/token";
import { useUser } from "../hooks/useUser";

export interface AuthContextType {
  auth: { token: string; me: any } | null | undefined;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  auth: undefined,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<{ token: string; me: any } | null | undefined>(undefined);
  const { getMe } = useUser();

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (!token) {
        setAuth(null);
      } else {
        try {
          const me = await getMe(token);
          setAuth({ token, me });
        } catch (error) {
          console.error("Token expirado o inválido:", error);
          removeToken();
          setAuth(null);
        }
      }
    };

    initAuth();
  }, []);

  const login = async (token: string) => {
    setToken(token);
    try {
      const me = await getMe(token);
      setAuth({ token, me });
    } catch (error) {
      console.error("Error al obtener datos del usuario tras login:", error);
      removeToken();
      setAuth(null);
      throw error;
    }
  };

  const logout = () => {
    setAuth(null);
    removeToken();
  };

  const valueContext = {
    auth,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={valueContext}>
      {children}
    </AuthContext.Provider>
  );
}
