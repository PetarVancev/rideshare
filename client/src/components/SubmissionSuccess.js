import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SubmissionSuccess = ({ statusMessage, nextStepsMessage, goTo }) => {
  const navigate = useNavigate();
  return (
    <div className="text-center submission-status-container">
      <div className="submission-message">
        <img src="images/success-icon.svg" className="status-img" />
        <h2 className="body-bold-l">{statusMessage}</h2>
        <hr />
        <p>Ви благодариме што ја користевте нашата апликација</p>
      </div>
      <div className="submission-bottom-bar">
        <p className="">{nextStepsMessage}</p>
        <div>
          <Button
            className="col-12 mt-4 dark-button body-bold-medium"
            onClick={() => navigate(goTo)}
          >
            Патувања
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSuccess;
