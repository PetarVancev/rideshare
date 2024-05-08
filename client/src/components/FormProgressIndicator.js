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
            {/* <svg
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
            </svg> */}
          </div>
          <span className="body-bold-xxs">Поаѓање</span>
        </div>
        <div className={`step-indicator ${step === 2 ? "current" : ""}`}>
          <span className="body-bold-xxs">Пристигање</span>
          <div className="d-flex align-items-center">
            <div className="step-circle">2</div>
            <div className={"step-arrow" + (step === 2 ? " current" : "")} />
            {/* <svg
              width="0"
              height="9"
              viewBox="0 0 40 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M39.7286 4.85355C39.9238 4.65829 39.9238 4.34171 39.7286 4.14645L36.5466 0.964466C36.3513 0.769204 36.0347 0.769204 35.8395 0.964466C35.6442 1.15973 35.6442 1.47631 35.8395 1.67157L38.6679 4.5L35.8395 7.32843C35.6442 7.52369 35.6442 7.84027 35.8395 8.03553C36.0347 8.2308 36.3513 8.2308 36.5466 8.03553L39.7286 4.85355ZM0.375 5H39.375V4H0.375V5Z"
                fill={step === 2 ? "#022c66" : "#8095B2"}
              />
            </svg> */}
          </div>
          <br />
        </div>
        <div className={`step-indicator ${step === 3 ? "current" : ""}`}>
          <br />
          <div className="d-flex align-items-center">
            <div className="step-circle">3</div>
            <div className={"step-arrow" + (step === 3 ? " current" : "")} />
            {/* <svg
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
            </svg> */}
          </div>
          <span className="body-bold-xxs">Места</span>
        </div>
        <div className={`step-indicator ${step === 4 ? "current" : ""}`}>
          <span className="body-bold-xxs">Цена</span>
          <br />
          <div className="d-flex align-items-center">
            <div className="step-circle">4</div>
            <div className={"step-arrow" + (step === 4 ? " current" : "")} />
            {/* <svg
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
            </svg> */}
          </div>
        </div>
        <div
          className={`step-indicator last-step ${step === 5 ? "current" : ""}`}
        >
          <br />
          <div className="step-circle">5</div>
          <span className="body-bold-xxs">Порака</span>
        </div>
      </div>
    </Container>
  );
};

export default FormProgressIndicator;
