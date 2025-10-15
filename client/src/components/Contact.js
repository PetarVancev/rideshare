import React, { useRef } from "react";
import { Container, Form } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NavBar from "./NavBar";
import BottomBar from "./BottomBar";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Contact = () => {
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const url = backendUrl + `/support/send-contact-form`;
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        formRef.current.reset();
        toast.success("Your message has been successfully sent.");
      } else {
        toast.error("Error sending the message. Please try again later.");
      }
    } catch (error) {
      toast.error("Error sending the message. Please try again later.");
    }
  };

  return (
    <div className="has-bottom-bar">
      <NavBar type="white" />
      <BottomBar />
      <Container className="contact-container">
        <h1 className="heading-s text-center pt-4 pb-4 mb-0 border-bottom">
          Contact
        </h1>
        <div className="d-flex justify-content-between border-bottom pb-4 pt-4">
          <h3 className="body-bold-l mb-0">General questions</h3>
          <a
            href="mailto:contact@rideshare.mk"
            className="body-s blue-text d-flex align-items-center"
          >
            contact@rideshare.mk
          </a>
        </div>
        <div className="d-flex justify-content-between border-bottom pb-4 pt-4">
          <h3 className="body-bold-l mb-0">For payments</h3>
          <a
            href="mailto:payments@rideshare.mk"
            className="body-s blue-text d-flex align-items-center"
          >
            payments@rideshare.mk
          </a>
        </div>
        <div className="d-flex justify-content-between border-bottom pb-4 pt-4">
          <h3 className="body-bold-l mb-0">Follow us</h3>
          <div className="d-flex">
            <a
              className="body-s blue-text d-flex align-items-center me-4"
              href="https://www.instagram.com/ridesharemk/"
            >
              Instagram
            </a>
            <a
              className="body-s blue-text d-flex align-items-center"
              href="https://www.facebook.com/people/Rideshare/61558760050670/"
            >
              Facebook
            </a>
          </div>
        </div>
        <div className="pt-4">
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Control
                type="text"
                name="name"
                placeholder="Name"
                className="outline-input"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                className="outline-input"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formMessage">
              <Form.Control
                as="textarea"
                name="message"
                rows={6}
                placeholder="Message"
                className="outline-input"
                required
              />
            </Form.Group>
            <div className="text-end">
              <button className="outline-button" type="submit">
                Send
              </button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default Contact;
