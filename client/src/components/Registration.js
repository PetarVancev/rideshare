import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./AuthContext";
import NavBar from "./NavBar";
import BackButton from "./BackButton";
import BottomBar from "./BottomBar";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Registration = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("passenger");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { registerUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { email, password, name, phone };
    const res = await registerUser(user, userType);
    if (res.error) {
      setMessage("");
      setError(res.error);
    } else if (res.success) {
      setError("");
      setMessage(res.success);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
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
          <h2>Податоци за вас</h2>
          <Form onSubmit={handleSubmit} className="auth-forms">
            <Form.Group controlId="formBasicName">
              <Form.Control
                type="text"
                placeholder="Вашeто име"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="auth-text-input"
              />
            </Form.Group>
            <Form.Group controlId="formBasicPhone">
              <Form.Control
                type="tel"
                placeholder="Телефонски број"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="auth-text-input"
              />
            </Form.Group>
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
                className="auth-text-input"
              />
            </Form.Group>

            <Form.Group controlId="formBasicUserType">
              <Form.Label>Апликацијата ќе ја користам како:</Form.Label>
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

            <Button className="dark-button col-12" type="submit">
              Креирајте го вашиот профил
            </Button>
          </Form>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
        </div>
      </Container>
    </div>
  );
};

export default Registration;
