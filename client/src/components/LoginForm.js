import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

import { useAuth } from "./AuthContext";
import NavBar from "./NavBar";
import BackButton from "./BackButton";
import BottomBar from "./BottomBar";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("passenger");

  const [error, setError] = useState("");

  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(email, password, userType);
    if (res.error) {
      setError(res.error);
    }
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  return (
    <div>
      <NavBar />
      <BottomBar />
      <Container>
        <BackButton />
        <div className="auth-container">
          <h2>Најави се</h2>
          <Form onSubmit={handleSubmit} className="auth-forms">
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Вашата е-пошта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-text-input"
              />
            </Form.Group>

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
            <div className="text-end">
              <a
                className="forgot-password"
                onClick={() => navigate("/request-password-reset")}
              >
                Ја заборави лозинката?
              </a>
            </div>
            <Form.Group controlId="formBasicUserType">
              <Form.Label>Се најавувам како:</Form.Label>
              <Container>
                <Row>
                  <Col xs={6} className="ml-5">
                    <Form.Check
                      label="Патник"
                      type="radio"
                      id="passengerRadio"
                      name="userType"
                      value="passenger"
                      checked={userType === "passenger"}
                      onChange={handleUserTypeChange}
                    />
                  </Col>
                  <Col xs={6}>
                    <Form.Check
                      label="Возач"
                      type="radio"
                      id="driverRadio"
                      name="userType"
                      value="driver"
                      checked={userType === "driver"}
                      onChange={handleUserTypeChange}
                    />
                  </Col>
                </Row>
              </Container>
            </Form.Group>

            <Button className="dark-button col-12 mt-4" type="submit">
              Најави се
            </Button>
            <Button
              className="dark-button col-12 mt-2"
              onClick={() => navigate("/register")}
            >
              Регистрирај се
            </Button>
          </Form>
          {error && <Alert variant="danger">{error}</Alert>}
        </div>
      </Container>
    </div>
  );
};

export default Login;
