import React from "react";

const StarRating = ({ filledStars }) => {
  const maxStars = 5;

  const starsCount = Math.min(filledStars, maxStars);

  const stars = Array.from({ length: starsCount }, (_, index) => (
    <i className="fas fa-star" key={index}></i>
  ));

  const remainingStars = Array.from(
    { length: maxStars - starsCount },
    (_, index) => <i className="far fa-star" key={starsCount + index}></i>
  );

  return (
    <div>
      {stars}
      {remainingStars}
    </div>
  );
};

export default StarRating;
