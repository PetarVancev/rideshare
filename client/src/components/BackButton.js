import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const BackButton = ({ customNav }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!customNav) {
      navigate(-1);
    } else {
      customNav();
    }
  };

  return (
    <button
      className="transparent-button pl-0 mb-4 mt-3 back-button"
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faChevronLeft} size="xs" />
      &nbsp;&nbsp;Назад
    </button>
  );
};

export default BackButton;
