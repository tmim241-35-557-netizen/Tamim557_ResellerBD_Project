import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5001/api";  // ✅ Make sure this is correct
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Attempting login:", email); // Debug log
      
      const response = await axios.post(`${API}/auth/login`, { 
        email, 
        password 
      });
      
      console.log("Login response:", response.data); // Debug log
      
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
      
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      
      // Better error handling
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.code === "ERR_NETWORK") {
        throw new Error("Cannot connect to server. Make sure backend is running.");
      } else {
        throw new Error("Login failed. Please try again.");
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}