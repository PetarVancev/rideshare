import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import NavBar from "./NavBar";
import BackButton from "./BackButton";
import BottomBar from "./BottomBar";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const PasswordResetForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const userType = queryParams.get("usertype");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if password meets criteria
    const passwordRegex = /^(?=.*[A-ZА-Ш]).{8,}$/i;
    if (!passwordRegex.test(password)) {
      setError(
        "Лозинката мора да има најмалку 8 карактери и една голема буква"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Лозинките не се совпаѓаат");
      return;
    }

    try {
      console.log(password);
      const response = await axios.post(
        backendUrl + `/auth/${userType}/password-reset`,
        {
          resetToken: token,
          newPassword: password,
        }
      );
      setError("");
      setSuccessMessage(
        "Успешно е променета вашата лозинка. Ќе бидете пренасочени на страната за најава"
      );
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data) {
        setSuccessMessage("");
        setError(error.response.data.error);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <NavBar />
      <BottomBar />
      <Container>
        <BackButton />
        <div className="auth-container">
          <h2>Промена на лозинка</h2>
          <Form onSubmit={handleSubmit} className="auth-forms">
            <Form.Group controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Лозинка"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-text-input mb-1"
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Повторете ја лозинката"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="auth-text-input mb-1"
              />
            </Form.Group>

            <Button className="dark-button col-12 mt-4" type="submit">
              Промени лозинка
            </Button>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && (
              <Alert variant="success">{successMessage}</Alert>
            )}
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default PasswordResetForm;
