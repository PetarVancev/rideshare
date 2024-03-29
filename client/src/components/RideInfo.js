import React, { useState, useEffect } from "react";
import { Card, Button, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import axios from "axios";

import NavBar from "./NavBar";
import BottomBar from "./BottomBar";
import BackButton from "./BackButton";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const RideInfo = () => {
  const location = useLocation();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const rideId = queryParams.get("rideId");

        const searchApi = backendUrl + `/rides/get-ride?rideId=${rideId}`;
        const response = await axios.get(searchApi);
        setRide(response.data);
      } catch (error) {
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchRide();
  }, [location.search]);

  if (loading) {
    return <>{/* Render loading indicator here */}</>;
  }

  if (!ride) {
    return (
      <>
        <NavBar />
        <BottomBar />
        <Container>
          <p className="text-center rides-count body-bold-xs mt-2">
            Бараниот превоз не постои
          </p>
        </Container>
      </>
    ); // or any other loading indicator
  }

  const departureDateTime = new Date(ride.date_time);
  const departureHours = departureDateTime
    .getHours()
    .toString()
    .padStart(2, "0");
  const departureMinutes = departureDateTime
    .getMinutes()
    .toString()
    .padStart(2, "0");
  const departureTime = `${departureHours}:${departureMinutes}`;

  let arrivalTime = "";
  let rideDuration = "";

  if (ride.ride_duration) {
    const [rideDurationHours, rideDurationMinutes] = ride.ride_duration
      .split(":")
      .map(Number);
    const arrivalDateTime = new Date(departureDateTime);
    arrivalDateTime.setHours(departureDateTime.getHours() + rideDurationHours);
    arrivalDateTime.setMinutes(
      departureDateTime.getMinutes() + rideDurationMinutes
    );
    const arrivalHours = arrivalDateTime.getHours().toString().padStart(2, "0");
    const arrivalMinutes = arrivalDateTime
      .getMinutes()
      .toString()
      .padStart(2, "0");
    arrivalTime = `${arrivalHours}:${arrivalMinutes}`;
    rideDuration = `${rideDurationHours
      .toString()
      .padStart(2, "0")}:${rideDurationMinutes.toString().padStart(2, "0")}`;
  }

  return (
    <>
      <NavBar />
      <Container className="ride-info">
        <BackButton />
        <div className="driver-info text-center">
          <h3 className="body-bold-medium heading-xs">{ride.driver_name}</h3>
          <a className="body-xs mx-auto">4.8/5</a>
        </div>
        <div className="d-flex destination-info justify-content-between px">
          <div className="d-flex flex-column">
            <h4 className="heading-xs">{ride.from_location_name}</h4>
            <span className="body-bold-xs">{departureTime}</span>
          </div>
          <div className="d-flex flex-column">
            <span className="text-center body-bold-xs">{rideDuration}</span>
            <img
              src="/images/journey-indicator-horizontal.svg"
              className="journey-indicator"
            />
          </div>
          <div className="d-flex flex-column">
            <h4 className="heading-xs">{ride.to_location_name}</h4>
            <span className="body-bold-xs">{arrivalTime}</span>
          </div>
        </div>
        <div>
          <h4>Порака за патниците</h4>
          <p>
            {!!ride.additional_info
              ? ride.additional_info
              : "Превозникот нема наведено информации кои би ви биле потребни."}
          </p>
        </div>
        <div className="info-box2">
          <span>
            <img src="images/group-icon.svg" />
            <h4>{`Најмногу ${ride.total_seats - 2} на задните седишта`}</h4>
          </span>
          <span className="mb-0">
            <img src="images/car-icon.svg" />
            <h4>{`${ride.car_model} - ${ride.car_color}`}</h4>
          </span>
        </div>
        {/* <Button>Зачувај</Button> */}
        <Button className="dark-button col-12 mt-4 reserve-button">
          Повеќе
        </Button>
      </Container>
    </>
  );
};

export default RideInfo;
