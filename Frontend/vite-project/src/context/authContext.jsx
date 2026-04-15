// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(true);

  const saveAuth = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const clearAuth = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  const login = async (email, password) => {
    const res = await api.post("/login", { email, password });
    const { accessToken, user } = res.data;
    saveAuth(accessToken, user);
    return res.data;
  };

  const signup = async (username, email, password) => {
    const res = await api.post("/signup", { username, email, password });
    const { accessToken, user } = res.data;
    saveAuth(accessToken, user);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } finally {
      clearAuth();
    }
  };

  const refreshAccessToken = async () => {
    try {
      const res = await api.post("/refresh");
      const newToken = res.data.accessToken;
      setAccessToken(newToken);
      localStorage.setItem("accessToken", newToken);
      return newToken;
    } catch (err) {
      clearAuth();
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) setUser(JSON.parse(savedUser));

      if (!accessToken) {
        await refreshAccessToken();
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        signup,
        logout,
        refreshAccessToken,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);