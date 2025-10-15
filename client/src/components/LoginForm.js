import React, { useState } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <NavBar />
      <BottomBar />
      <Container>
        <BackButton />
        <div className="auth-container">
          <h2>Log In</h2>
          <Form onSubmit={handleSubmit} className="auth-forms">
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-text-input"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <div className="input-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-text-input mb-1"
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="show-password"
                    onClick={toggleShowPassword}
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
            <div className="text-end">
              <a
                className="forgot-password"
                onClick={() => navigate("/request-password-reset")}
              >
                Forgot your password?
              </a>
            </div>
            <Form.Group controlId="formBasicUserType">
              <Form.Label>Logging in as:</Form.Label>
              <Container>
                <Row>
                  <Col xs={6} className="ml-5">
                    <Form.Check
                      label="Passenger"
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
                      label="Driver"
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
              Log In
            </Button>
            <Button
              className="dark-button dark-outline-button col-12 mt-2"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Form>
          {error && <Alert variant="danger">{error}</Alert>}
        </div>
      </Container>
    </div>
  );
};

export default Login;
