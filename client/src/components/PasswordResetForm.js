import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useLocation } from "react-router-dom";

import NavBar from "./NavBar";
import BackButton from "./BackButton";
import BottomBar from "./BottomBar";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const PasswordResetForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(token);
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
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default PasswordResetForm;
