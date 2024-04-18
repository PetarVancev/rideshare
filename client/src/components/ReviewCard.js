import React from "react";
import { Card, Button } from "react-bootstrap";
import StarReview from "./StarReview";

const ReviewCard = ({ review }) => {
  return (
    <Card className="review-card body-bold-xs">
      <Card.Header>
        <h5>Evgenija</h5>
      </Card.Header>
      <Card.Body>
        <div className="d-flex justify-content-between mb-2">
          <span>Поагање на време</span>
          <StarReview filledStars={review.time_correctness_score} />
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Сигурност</span>
          <StarReview filledStars={review.safety_score} />
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Комоција</span>
          <StarReview filledStars={review.comfort_score} />
        </div>
        <Button className="col-12 mt-4 white-button body-bold-xs">
          Повеќе
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;
