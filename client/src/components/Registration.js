import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

import NavBar from "./NavBar";
import BackButton from "./BackButton";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Registration = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("passenger");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/auth/register/driver`, {
        email,
        password,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Registration failed:", error.response.data.error);
      setError(error.response.data.error);
    }
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value); // Update the role state when the radio input changes
  };

  return (
    <div>
      <NavBar />
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
