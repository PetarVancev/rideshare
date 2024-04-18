import React, { useState } from "react";

const StarSelector = ({ name }) => {
  const [selectedStars, setSelectedStars] = useState(1);
  const handleStarClick = (starCount) => {
    setSelectedStars(starCount);
  };

  return (
    <div className="star-selector">
      <input type="hidden" name={name} value={selectedStars} />
      {[...Array(5)].map((_, index) => (
        <span key={index} onClick={() => handleStarClick(index + 1)}>
          {index < selectedStars ? (
            <i className="fas fa-star"></i>
          ) : (
            <i className="far fa-star"></i>
          )}
        </span>
      ))}
    </div>
  );
};

export default StarSelector;
