import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const BackButton = ({ url }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(url); // Navigate to the specified URL
  };

  return (
    <button className="transparent-button pl-0 mb-4 mt-3" onClick={handleClick}>
      <FontAwesomeIcon icon={faChevronLeft} size="xs" />
      &nbsp;&nbsp;Назад
    </button>
  );
};

export default BackButton;
