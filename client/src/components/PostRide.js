import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

import NavBar from "./NavBar";
import BottomBar from "./BottomBar";

const PostRide = () => {
  const [step, setStep] = useState(1);

  const handleStepChange = (newStep) => {
    setStep(newStep);
  };

  return (
    <div>
      <NavBar type="green" />
      <BottomBar />

      <div className="post-ride-cta">
        <Container>
          <h2 className="heading-s">
            Објавете превоз и поделете ги трошоците за патувањето!
          </h2>
          <p className="body-xs">
            Патниците чекаат на вас! Објавете превоз и намалете ги трошоците за
            вашето патување
          </p>
          <img src="images/cta-underline.svg" />
        </Container>
      </div>
      <div className="steps-container">
        <div className="d-flex steps-inside-container">
          <div className={`step-indicator ${step === 1 ? "current" : ""}`}>
            <br />
            <div className="d-flex align-items-center">
              <div className="step-circle">1</div>
              <svg
                width="40"
                height="9"
                viewBox="0 0 40 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M39.7286 4.85355C39.9238 4.65829 39.9238 4.34171 39.7286 4.14645L36.5466 0.964466C36.3513 0.769204 36.0347 0.769204 35.8395 0.964466C35.6442 1.15973 35.6442 1.47631 35.8395 1.67157L38.6679 4.5L35.8395 7.32843C35.6442 7.52369 35.6442 7.84027 35.8395 8.03553C36.0347 8.2308 36.3513 8.2308 36.5466 8.03553L39.7286 4.85355ZM0.375 5H39.375V4H0.375V5Z"
                  fill={step === 1 ? "#022c66" : "#8095B2"}
                />
              </svg>
            </div>
            <span className="body-bold-xxs">Поаѓање</span>
          </div>
          <div className={`step-indicator ${step === 2 ? "current" : ""}`}>
            <span className="body-bold-xxs">Пристигање</span>
            <div className="d-flex align-items-center">
              <div className="step-circle">2</div>
              <svg
                width="40"
                height="9"
                viewBox="0 0 40 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M39.7286 4.85355C39.9238 4.65829 39.9238 4.34171 39.7286 4.14645L36.5466 0.964466C36.3513 0.769204 36.0347 0.769204 35.8395 0.964466C35.6442 1.15973 35.6442 1.47631 35.8395 1.67157L38.6679 4.5L35.8395 7.32843C35.6442 7.52369 35.6442 7.84027 35.8395 8.03553C36.0347 8.2308 36.3513 8.2308 36.5466 8.03553L39.7286 4.85355ZM0.375 5H39.375V4H0.375V5Z"
                  fill={step === 2 ? "#022c66" : "#8095B2"}
                />
              </svg>
            </div>
            <br />
          </div>
          <div className={`step-indicator ${step === 3 ? "current" : ""}`}>
            <br />
            <div className="d-flex align-items-center">
              <div className="step-circle">3</div>
              <svg
                width="40"
                height="9"
                viewBox="0 0 40 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M39.7286 4.85355C39.9238 4.65829 39.9238 4.34171 39.7286 4.14645L36.5466 0.964466C36.3513 0.769204 36.0347 0.769204 35.8395 0.964466C35.6442 1.15973 35.6442 1.47631 35.8395 1.67157L38.6679 4.5L35.8395 7.32843C35.6442 7.52369 35.6442 7.84027 35.8395 8.03553C36.0347 8.2308 36.3513 8.2308 36.5466 8.03553L39.7286 4.85355ZM0.375 5H39.375V4H0.375V5Z"
                  fill={step === 3 ? "#022c66" : "#8095B2"}
                />
              </svg>
            </div>
            <span className="body-bold-xxs">Места</span>
          </div>
          <div className={`step-indicator ${step === 4 ? "current" : ""}`}>
            <span className="body-bold-xxs">Цена</span>
            <br />
            <div className="d-flex align-items-center">
              <div className="step-circle">4</div>
              <svg
                width="40"
                height="9"
                viewBox="0 0 40 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M39.7286 4.85355C39.9238 4.65829 39.9238 4.34171 39.7286 4.14645L36.5466 0.964466C36.3513 0.769204 36.0347 0.769204 35.8395 0.964466C35.6442 1.15973 35.6442 1.47631 35.8395 1.67157L38.6679 4.5L35.8395 7.32843C35.6442 7.52369 35.6442 7.84027 35.8395 8.03553C36.0347 8.2308 36.3513 8.2308 36.5466 8.03553L39.7286 4.85355ZM0.375 5H39.375V4H0.375V5Z"
                  fill={step === 4 ? "#022c66" : "#8095B2"}
                />
              </svg>
            </div>
          </div>
          <div
            className={`step-indicator last-step ${
              step === 5 ? "current" : ""
            }`}
          >
            <br />
            <div className="step-circle">5</div>
            <span className="body-bold-xxs">Порака</span>
          </div>
        </div>
      </div>
      <Container className="post-ride-fillable">
        <section className="bottom-border">
          <div>
            <h4 className="heading-xxs">Избери локација на поаѓање</h4>
          </div>
          <div>
            <div className="d-flex justify-content-between accept-location-suggestions">
              <h4 className="heading-xxs">Добивај предлог локација</h4>
              <Form>
                <Form.Switch
                  id="custom-switch"
                  checked={0}
                  onChange={0}
                  className="switch"
                />
              </Form>
            </div>
            <p className="body-xs">
              Доколку се согласите на оваа опција ќе добивате локација од која
              би сакале да бидат земени патниците.
              <strong>Ќе имате можност да ја прифатите или одбиете.</strong>
            </p>
          </div>
        </section>
        <section>
          <div className="d-flex">
            <img src="images/clock-icon.svg" />
            <h4 className="heading-xxs mb-0">Одберете време на поаѓање</h4>
          </div>
          <input
            className="time-input"
            type="text"
            id="timeInput"
            placeholder="hh:mm"
            maxLength="5"
          />
        </section>
      </Container>
    </div>
  );
};

export default PostRide;
