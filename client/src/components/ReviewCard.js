import React from "react";
import { Card, Button } from "react-bootstrap";
import StarReview from "./StarReview";

const ReviewCard = ({ review }) => {
  const reviewDate = new Date(review.date_time).toLocaleDateString("en-EU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return (
    <Card className="review-card body-bold-xs">
      <Card.Header>
        <div className="d-flex justify-content-between pe-3">
          <h5>{review.name}</h5>
          <span>{reviewDate}</span>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="review-text-container">
          <p className="review-text">{review.text}</p>
        </div>
        <div className="d-flex justify-content-between mb-1">
          <span>Поагање на време</span>
          <StarReview filledStars={review.time_correctness_score} />
        </div>
        <div className="d-flex justify-content-between mb-1">
          <span>Сигурност</span>
          <StarReview filledStars={review.safety_score} />
        </div>
        <div className="d-flex justify-content-between mb-1">
          <span>Комоција</span>
          <StarReview filledStars={review.comfort_score} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;
