import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userType, setUserType] = useState(null); // Adding userType state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserType = localStorage.getItem("userType"); // Retrieve userType from localStorage
    setToken(storedToken);
    setUserType(storedUserType); // Set userType from localStorage
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, setToken, userType, setUserType, loading }}
    >
      {" "}
      {/* Expose userType and setUserType in the context */}
      {children}
    </AuthContext.Provider>
  );
};
