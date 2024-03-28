import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

import { useAuth } from "./AuthContext";
import NavBar from "./NavBar";
import BottomBar from "./BottomBar";
import MyRideCard from "./MyRideCard";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const MyRides = () => {
  const { isLoggedIn, token, userType } = useAuth();
  const [category, setCategory] = useState("active");
  const [rideData, setRideData] = useState(null);

  useEffect(() => {
    if (isLoggedIn()) {
      fetchRideData();
    }
  }, [location.search]);

  const fetchRideData = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/reservations/${userType}/get-my`, // Using userType directly here
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

  return (
    <div>
      <NavBar />
      <BottomBar />
      <Container>
        <Row className="category-select justify-content-center mt-3 body-bold-medium">
          <Col className="text-center" xs={4}>
            <a
              className={` ${
                category === "active" ? "selected" : ""
              } d-flex justify-content-center`}
              onClick={() => {
                handleCategoryChange("active");
              }}
            >
              <span>Активни</span>
            </a>
          </Col>
          <Col className="text-center" xs={4}>
            <a
              className={` ${
                category === "proposed" ? "selected" : ""
              } d-flex justify-content-center`}
              onClick={() => {
                handleCategoryChange("proposed");
              }}
            >
              <span>Предложени</span>
            </a>
          </Col>
          <Col className="text-center" xs={4}>
            <a
              className={` ${
                category === "completed" ? "selected" : ""
              } d-flex justify-content-center`}
              onClick={() => {
                handleCategoryChange("completed");
              }}
            >
              <span>Завршени</span>
            </a>
          </Col>
        </Row>

        <div className="my-rides-container">
          {rideData &&
            rideData.map((ride, index) => (
              <MyRideCard key={index} rideData={ride} />
            ))}
        </div>
      </Container>
    </div>
  );
};

export default MyRides;
