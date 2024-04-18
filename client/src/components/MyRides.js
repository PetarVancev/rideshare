import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";

import { useAuth } from "./AuthContext";
import NavBar from "./NavBar";
import BottomBar from "./BottomBar";
import MyRideCard from "./MyRideCard";
import WriteReviewModal from "./WriteReviewModal";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const MyRides = () => {
  const location = useLocation();
  const { isLoggedIn, token, userType } = useAuth();
  const [category, setCategory] = useState("R");
  const [rideData, setRideData] = useState(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedRideId, setSelectedRideId] = useState(null);

  useEffect(() => {
    if (isLoggedIn()) {
      fetchRideData();
    }
  }, [location.search, category, setReviewModalOpen]);

  const fetchRideData = async () => {
    try {
      let url = `${backendUrl}/reservations/${userType}/get-my?status=${category}`;
      if (userType == "driver") {
        url = `${backendUrl}/rides/get-my?status=${category}`;
      }
      const response = await axios.get(
        url, // Using userType directly here
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setRideData(response.data);
    } catch (error) {
      console.error("Error fetching ride data:", error);
    }
  };

  function handleCategoryChange(selectedCategory) {
    setCategory(selectedCategory);
  }

  const handleOpenReviewModal = (rideId) => {
    setSelectedRideId(rideId); // Set the selected rideId when opening the modal
    setReviewModalOpen(true);
  };

  return (
    <div className="has-bottom-bar">
      <NavBar />
      <BottomBar />
      <WriteReviewModal
        open={reviewModalOpen}
        handleClose={() => setReviewModalOpen(false)}
        rideId={selectedRideId}
      />
      <Container>
        <Row className="category-select justify-content-center mt-3 body-bold-medium">
          <Col className="text-center" xs={4}>
            <a
              className={` ${
                category === "R" ? "selected" : ""
              } d-flex justify-content-center`}
              onClick={() => {
                handleCategoryChange("R");
              }}
            >
              <span>Активни</span>
            </a>
          </Col>
          {userType == "passenger" && (
            <Col className="text-center" xs={4}>
              <a
                className={` ${
                  category === "P" ? "selected" : ""
                } d-flex justify-content-center`}
                onClick={() => {
                  handleCategoryChange("P");
                }}
              >
                <span>Предложени</span>
              </a>
            </Col>
          )}
          <Col className="text-center" xs={4}>
            <a
              className={` ${
                category === "C" ? "selected" : ""
              } d-flex justify-content-center`}
              onClick={() => {
                handleCategoryChange("C");
              }}
            >
              <span>Завршени</span>
            </a>
          </Col>
        </Row>

        <div className="my-rides-container">
          {rideData &&
            rideData.map((ride, index) => {
              return (
                <MyRideCard
                  key={index}
                  userType={userType}
                  rideData={ride}
                  category={category}
                  token={token}
                  openReviewModal={() => handleOpenReviewModal(ride.ride.id)}
                />
              );
            })}
        </div>
      </Container>
    </div>
  );
};

export default MyRides;
