import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [userType, setUserType] = useState(null); // Adding userType state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    if (token && userType) {
      setToken(token);
      setUserType(userType);
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password, userType) => {
    try {
      const response = await axios.post(
        backendUrl + `/auth/login/${userType}`,
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userType", userType);
      setToken(response.data.token);
      setUserType(userType);
      navigate("/");
      return { succes: "Login successful" };
    } catch (error) {
      if (error.response && error.response.data) {
        return { error: error.response.data.message };
      } else {
        return { error: "An unexpected error occurred. Please try again." };
      }
    }
  };

  const registerUser = async (user, userType) => {
    const passwordRegex = /^(?=.*[A-ZА-Ш]).{8,}$/i;
    if (!passwordRegex.test(user.password)) {
      return {
        error: "Лозинката мора да има најмалку 8 карактери и една голема буква",
      };
    }
    try {
      const response = await axios.post(
        `${backendUrl}/auth/register/${userType}`,
        {
          email: user.email,
          password: user.password,
          name: user.name,
          phone_num: user.phone,
        }
      );
      return {
        success:
          "Успешно е креиран вашиот профил, ќе бидете пренасочени на страната за најава",
      };
    } catch (error) {
      if (error.response && error.response.data) {
        return {
          error: error.response.data.message,
        };
      } else {
        return {
          error: "An unexpected error occurred. Please try again.",
        };
      }
    }
  };

  const isLoggedIn = () => {
    return !!(userType && token);
  };

  return (
    <AuthContext.Provider
      value={{ loginUser, userType, token, loading, registerUser, isLoggedIn }}
    >
      {loading ? <></> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
