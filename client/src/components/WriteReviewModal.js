// WriteReviewModal.js
import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

import { useAuth } from "./AuthContext";
import StarSelector from "./StarSelector";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const WriteReviewModal = ({ handleClose, open, rideId }) => {
  const { token } = useAuth();
  const [reviewText, setReviewText] = useState("");

  const handleReviewTextChange = (event) => {
    if (event.target.value.length <= 100) {
      setReviewText(event.target.value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const reviewData = {
      rideId: rideId,
      time_correctness_score: formData.get("departureTime"),
      safety_score: formData.get("safety"),
      comfort_score: formData.get("comfort"),
      text: reviewText,
    };

    try {
      const url = `${backendUrl}/reviews/post-review`;
      const response = await axios.post(url, reviewData, {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.dismiss();
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeButton: true,
        onClose: () => window.location.reload(),
      });
      handleClose();
    } catch (error) {
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
    <Container className={`write-review-modal ${open ? "" : "hide"}`}>
      <h3 className="heading-xxs text-center gray-text mt-4">Благодариме</h3>
      <h1 className="heading-xxs mt-5 mb-4">
        Споделете го вашето искуство со возачот
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="text-center review-raitings-inputs pt-3 pb-3">
          <div className="mb-2">
            <h4 className="body-bold-s mb-1">Поаѓање на време</h4>
            <StarSelector name={"departureTime"} />
          </div>
          <div className="mb-2">
            <h4 className="body-bold-s mb-1">Сигурност</h4>
            <StarSelector name={"safety"} />
          </div>
          <div className="mb-2">
            <h4 className="body-bold-s mb-1">Комоција</h4>
            <StarSelector name={"comfort"} />
          </div>
        </div>
        <h3 className="heading-xxs mt-4 mb-4">
          Оставете краток опис за патувањето
        </h3>
        <textarea
          className="review-text-input"
          value={reviewText}
          onChange={handleReviewTextChange}
        ></textarea>
        <p className="text-end gray-text body-bold-s">
          {reviewText.length}/100
        </p>
        <Row className="submission-bottom-bar modal-bottom-bar">
          <Col xs={6}>
            <Button
              className="col-12 mt-4 dark-button body-bold-medium dark-outline-button"
              onClick={handleClose}
            >
              Затвори
            </Button>
          </Col>
          <Col xs={6}>
            <Button
              type="submit"
              className="col-12 mt-4 dark-button body-bold-medium"
            >
              Испрати
            </Button>
          </Col>
        </Row>
      </form>
    </Container>
  );
};

export default WriteReviewModal;
