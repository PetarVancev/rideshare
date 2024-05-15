import React, { useRef } from "react";
import { Container, Form } from "react-bootstrap";
import axios from "axios";

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
        alert("Вашата порака е успешно испратена.");
      } else {
        alert(
          "Грешка при испракањето на пораката. Ве молиме обидете се подоцна."
        );
      }
    } catch (error) {
      alert(
        "Грешка при испракањето на пораката. Ве молиме обидете се подоцна."
      );
    }
  };

  return (
    <div>
      <NavBar type="white" />
      <BottomBar />
      <Container className="contact-container">
        <h1 className="heading-s text-center pt-4 pb-4 mb-0 border-bottom">
          Контакт
        </h1>
        <div className="d-flex justify-content-between border-bottom pb-4 pt-4">
          <h3 className="body-bold-l mb-0">Генерални прашања</h3>
          <a className="body-s blue-text d-flex align-items-center">
            contact@rideshare.mk
          </a>
        </div>
        <div className="d-flex justify-content-between border-bottom pb-4 pt-4">
          <h3 className="body-bold-l mb-0">За плаќања</h3>
          <a className="body-s blue-text d-flex align-items-center">
            payments@rideshare.mk
          </a>
        </div>
        <div className="d-flex justify-content-between border-bottom pb-4 pt-4">
          <h3 className="body-bold-l mb-0">Следете не</h3>
          <div className="d-flex">
            <a className="body-s blue-text d-flex align-items-center me-4">
              Instagram
            </a>
            <a className="body-s blue-text d-flex align-items-center">
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
                placeholder="Име"
                className="outline-input"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Control
                type="email"
                name="email"
                placeholder="Е-пошта"
                className="outline-input"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formMessage">
              <Form.Control
                as="textarea"
                name="message"
                rows={6}
                placeholder="Порака"
                className="outline-input"
                required
              />
            </Form.Group>
            <div className="text-end">
              <button className="outline-button" type="submit">
                Испрати
              </button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default Contact;
