//client\src\context\AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AUTH_KEY = "hms_user";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (username, password, module) => {
    if (username === "receptionist" && password === "123") {
      const userData = { username, role: "receptionist", module };
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      setUser(userData);
      return { success: true, role: "receptionist", module };
    }
    if (username === "doctor" && password === "123") {
      const userData = { username, role: "doctor", module };
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      setUser(userData);
      return { success: true, role: "doctor", module };
    }
    return { success: false };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);