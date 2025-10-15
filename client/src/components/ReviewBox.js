import React from "react";
import { Container } from "react-bootstrap";

import StarRating from "./StarReview";

const ReviewBox = ({ reviewData }) => {
  const reviewDate = new Date(reviewData.date_time).toLocaleDateString(
    "en-EU",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  );

  return (
    <Container className="review-box-container">
      <div className="d-flex justify-content-between review-header">
        <h5 className="body-bold-medium">{reviewData.name}</h5>
        <span className="body-bold-xs blue-text">{reviewDate}</span>
      </div>
      <p className="blue-text">{reviewData.text}</p>
      <div className="review-ratings">
        <div className="d-flex justify-content-between">
          <h6 className="body-bold-xs">Punctuality</h6>
          <StarRating filledStars={reviewData.time_correctness_score} />
        </div>
        <div className="d-flex justify-content-between">
          <h6 className="body-bold-xs">Safety</h6>
          <StarRating filledStars={reviewData.safety_score} />
        </div>
        <div className="d-flex justify-content-between">
          <h6 className="body-bold-xs">Comfort</h6>
          <StarRating filledStars={reviewData.comfort_score} />
        </div>
      </div>
    </Container>
  );
};

export default ReviewBox;
