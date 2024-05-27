import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SubmissionSuccess = ({
  statusMessage,
  nextStepsMessage,
  goTo,
  className,
  buttonText,
  customButtonAction,
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
    <div
      className={`text-center submission-status-container ${className || ""}`}
    >
      <div className="submission-message">
        <img
          src="/images/success-icon.svg"
          className="status-img"
          alt="Success Icon"
        />
        <h2 className="body-bold-l">{statusMessage}</h2>
        <hr />
        <p>Ви благодариме што ја користевте нашата апликација</p>
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
  );
};

export default SubmissionSuccess;
