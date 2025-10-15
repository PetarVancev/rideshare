// WriteReviewModal.js
import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

import { useAuth } from "./AuthContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ComplaintModal = ({ handleClose, open, reservationId }) => {
  const { token, logoutUser } = useAuth();
  const [complaintText, setComplaintText] = useState("");
  const [success, setSuccess] = useState(false);

  const handleTextAreaChange = (event) => {
    if (event.target.value.length <= 300) {
      setComplaintText(event.target.value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const complaintData = {
      reservationId: reservationId,
      text: complaintText,
    };

    try {
      const url = `${backendUrl}/complaints/send-complaint`;
      const response = await axios.post(url, complaintData, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setSuccess(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logoutUser();
      }
      toast.dismiss();
      toast.error(error.response.data.error, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeButton: true,
      });
    }
  };

  return (
    <div className={`write-review-modal ${open ? "" : "hide"}`}>
      <Container>
        <h3 className="heading-xxs text-center gray-text mt-4 mb-5">
          {success
            ? "You have successfully sent a complaint"
            : "We are sorry that the ride did not take place"}
        </h3>
        {success ? (
          <div className="text-center">
            <img
              src="images/status-icon.svg"
              className="complaint-success-icon"
            />
            <h2 className="mt-3 body-bold-xl">
              Our team will review your response and you will be contacted
              within 3 working days!
            </h2>
            <Row className="submission-bottom-bar modal-bottom-bar">
              <Col xs={12}>
                <Button
                  className="col-12 mt-4 dark-button body-bold-medium"
                  onClick={handleClose}
                >
                  Close
                </Button>
              </Col>
            </Row>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="heading-xxs mt-4 mb-4">
              Explain why the ride did not take place
            </h3>
            <textarea
              className="review-text-input"
              value={complaintText}
              onChange={handleTextAreaChange}
              required
            ></textarea>
            <div className="d-flex justify-content-between gray-text body-bold-s">
              {complaintText.length}/300
            </div>
            <Row className="submission-bottom-bar modal-bottom-bar justify-content-center">
              <Col xs={6}>
                <Button
                  type="submit"
                  className="col-12 mt-4 dark-button body-bold-medium"
                >
                  Send
                </Button>
              </Col>
            </Row>
          </form>
        )}
      </Container>
    </div>
  );
};

export default ComplaintModal;
