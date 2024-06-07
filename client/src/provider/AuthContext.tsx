import { jwtDecode } from "jwt-decode";
import React, { createContext, useState, useEffect, useMemo } from "react";

interface AuthContextValue {
  token: string | null;
  id: string | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
}

interface JwtPayload {
  exp: number;
  id: string;
  user_role: string;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decoded = jwtDecode<JwtPayload>(storedToken);
      setToken(storedToken);
      setId(decoded.id);
      setRole(decoded.user_role);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Token expiration check every minute
    const interval = setInterval(() => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setToken(null);
        setId(null);
        setRole(null);
        clearInterval(interval);
        return;
      }

      const { exp } = jwtDecode<JwtPayload>(storedToken);
      const expirationTime = (exp ?? 0) * 1000;

      if (expirationTime < Date.now()) {
        logout();        
      }
    }, 1000); // Checking every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const login = (newToken: string) => {
    const decoded = jwtDecode<JwtPayload>(newToken);
    setToken(newToken);
    setId(decoded.id);
    setRole(decoded.user_role);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    setId(null);
    setRole(null);
    localStorage.removeItem("token");
  };

  const memoizedToken = useMemo(() => token, [token]);
  const memoizedId = useMemo(() => id, [id]);
  const memoizedRole = useMemo(() => role, [role]);

  const auth: AuthContextValue = {
    token: memoizedToken,
    id: memoizedId,
    role: memoizedRole,
    login,
    logout,
  };

  // Render children only when loading is false
  return (
    <AuthContext.Provider value={auth}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
