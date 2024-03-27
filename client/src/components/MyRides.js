import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";

import NavBar from "./NavBar";
import BottomBar from "./BottomBar";
import MyRideCard from "./MyRideCard";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const MyRides = () => {
  console.log(localStorage.getItem("userType"));
  console.log(localStorage.getItem("token"));
  const [category, setCategory] = useState("active");
  const [rideData, setRideData] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    setUserType(localStorage.getItem("userType"));
  }, []); // useEffect to set userType once on component mount

  useEffect(() => {
    if (userType) {
      // Only fetch data if userType is truthy
      fetchRideData();
    }
  }, [userType]); // useEffect to fetch data when userType changes

  const fetchRideData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Handle case where token is not available
      console.error("Token not found in localStorage");
      return;
    }

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
              href="#"
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
              href="#"
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
              href="#"
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
