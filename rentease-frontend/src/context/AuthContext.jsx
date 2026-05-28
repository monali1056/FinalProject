import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("rentease_token");
    const savedUser  = localStorage.getItem("rentease_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

 const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { token, user } = res.data;
    localStorage.setItem("rentease_token", token);
    localStorage.setItem("rentease_user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    return user;
  };

 const signup = async (name, email, password) => {
    const res = await authService.signup({ name, email, password });
    const { token, user } = res.data;
    localStorage.setItem("rentease_token", token);
    localStorage.setItem("rentease_user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("rentease_token");
    localStorage.removeItem("rentease_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      isAdmin: user?.role === "admin",
      isAuthenticated: !!token && !!user,
      login, signup, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;