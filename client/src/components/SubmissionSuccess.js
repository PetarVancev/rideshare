import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

const SubmissionSuccess = ({
  statusMessage,
  nextStepsMessage,
  goTo,
  className,
  buttonText,
  customButtonAction,
  hasNavBar,
  isError,
}) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (customButtonAction) {
      customButtonAction(); // Call the custom button action if provided
    } else {
      navigate(goTo); // Navigate if there is no custom action
    }
  };

  return (
    <>
      {hasNavBar && <NavBar />}
      <div
        className={`text-center submission-status-container ${className || ""}`}
      >
        <div className="submission-message">
          <img
            src={
              isError ? "/images/failed-icon.svg" : "/images/success-icon.svg"
            }
            className="status-img"
            alt={isError ? "Error Icon" : "Success Icon"}
          />
          <h2 className={`body-bold-l ${isError ? "red-text" : ""}`}>
            {statusMessage}
          </h2>
          <hr />
          <p>Thank you for using our application</p>
        </div>
        <div className="submission-bottom-bar">
          <p className="">{nextStepsMessage}</p>
          <div>
            <Button
              className="col-12 mt-4 dark-button body-bold-medium"
              onClick={handleButtonClick} // Call handleButtonClick instead of navigate directly
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmissionSuccess;
