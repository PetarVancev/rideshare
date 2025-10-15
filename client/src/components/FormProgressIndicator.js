import React from "react";
import { Container } from "react-bootstrap";

const FormProgressIndicator = ({ step }) => {
  return (
    <Container
    // className="steps-container"
    // style={step > 1 ? { paddingTop: "0" } : {}}
    >
      <div className="d-flex steps-inside-container">
        <div className={`step-indicator ${step === 1 ? "current" : ""}`}>
          <br />
          <div className="d-flex align-items-center">
            <div className="step-circle">1</div>
            <div className={"step-arrow" + (step === 1 ? " current" : "")} />
          </div>
          <span className="body-bold-xxs">Departure</span>
        </div>
        <div className={`step-indicator ${step === 2 ? "current" : ""}`}>
          <span className="body-bold-xxs">Arrival</span>
          <div className="d-flex align-items-center">
            <div className="step-circle">2</div>
            <div className={"step-arrow" + (step === 2 ? " current" : "")} />
          </div>
          <br />
        </div>
        <div className={`step-indicator ${step === 3 ? "current" : ""}`}>
          <br />
          <div className="d-flex align-items-center">
            <div className="step-circle">3</div>
            <div className={"step-arrow" + (step === 3 ? " current" : "")} />
          </div>
          <span className="body-bold-xxs">Seats</span>
        </div>
        <div className={`step-indicator ${step === 4 ? "current" : ""}`}>
          <span className="body-bold-xxs">Price</span>
          <br />
          <div className="d-flex align-items-center">
            <div className="step-circle">4</div>
            <div className={"step-arrow" + (step === 4 ? " current" : "")} />
          </div>
        </div>
        <div
          className={`step-indicator last-step ${step === 5 ? "current" : ""}`}
        >
          <br />
          <div className="step-circle">5</div>
          <span className="body-bold-xxs">Message</span>
        </div>
      </div>
    </Container>
  );
};

export default FormProgressIndicator;
