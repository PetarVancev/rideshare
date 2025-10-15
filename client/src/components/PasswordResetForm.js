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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[A-ZА-Ш]).{8,}$/i;
    if (!passwordRegex.test(password)) {
      setError(
        "The password must have at least 8 characters and one uppercase letter"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + `/auth/${userType}/password-reset`,
        {
          resetToken: token,
          newPassword: password,
        }
      );
      setError("");
      setSuccessMessage(
        "Your password has been successfully changed. You will be redirected to the login page"
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
          <h2>Change Password</h2>
          <Form onSubmit={handleSubmit} className="auth-forms">
            <Form.Group controlId="formBasicPassword">
              <div className="input-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-text-input mb-3"
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <i class="fa-regular fa-eye"></i>
                    ) : (
                      <i class="fa-regular fa-eye-slash"></i>
                    )}
                  </button>
                </div>
              </div>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="auth-text-input mb-1"
              />
            </Form.Group>

            <Button className="dark-button col-12 mt-4" type="submit">
              Change Password
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
