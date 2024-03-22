import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl + "/auth/login/driver", {
        email,
        password,
      });
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (error) {
      console.error("Authentication failed:", error);
      setToken(null);
      localStorage.removeItem("token");
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}{" "}
      <form onSubmit={handleSubmit}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
