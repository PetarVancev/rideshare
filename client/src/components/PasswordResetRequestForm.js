import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

import NavBar from "./NavBar";
import BackButton from "./BackButton";
import BottomBar from "./BottomBar";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("passenger");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsButtonDisabled(true);
      const response = await axios.post(
        backendUrl + `/auth/${userType}/request-password-reset`,
        {
          email,
          userType,
        }
      );
      setSuccessMessage(
        "Password reset request has been successfully sent. Please check your email. If you did not receive anything, try again after 1 minute."
      );
      setError("");
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 60000);
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
        setTimeout(() => {
          setIsButtonDisabled(false);
        }, 60000);
      } else {
        setError("An unexpected error occurred. Please try again.");
        setTimeout(() => {
          setIsButtonDisabled(false);
        }, 60000);
      }
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
          <h2>Password Reset</h2>
          <Form onSubmit={handleSubmit} className="auth-forms">
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-text-input"
              />
            </Form.Group>
            <Form.Group controlId="formBasicUserType">
              <Form.Label>User Type:</Form.Label>
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

            <Button
              className="dark-button col-12 mt-4"
              type="button"
              onClick={handleSubmit}
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Please wait..." : "Continue"}
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

export default PasswordResetRequest;
