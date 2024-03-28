import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <button className="transparent-button pl-0 mb-4 mt-3" onClick={handleClick}>
      <FontAwesomeIcon icon={faChevronLeft} size="xs" />
      &nbsp;&nbsp;Назад
    </button>
  );
};

export default BackButton;
