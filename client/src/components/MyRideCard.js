import React from "react";
import { Card, Button, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

import { useAuth } from "./AuthContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const MyRideCard = ({ userType, rideData, fetchRideData, category }) => {
  const { token } = useAuth();

  let ride = null;
  let reservation = null;
  let driver = null;
  let reservations = null;
  if (userType === "passenger") {
    ride = rideData.ride;
    reservation = rideData.reservation;
    driver = rideData.driver;
  } else {
    ride = rideData;
    reservations = rideData.reservations;
  }

  const departureDateTime = new Date(ride.date_time);
  const departureDate = departureDateTime.toLocaleDateString("en-GB");
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

  const confirmArrival = async () => {
    try {
      console.log(token);
      const url =
        backendUrl +
        `/reservations/passenger/confirm-arrival?reservationId=${reservation.id}`;
      const response = await axios.post(url, null, {
        headers: {
          Authorization: token,
        },
      });
      toast.dismiss();
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeButton: true,
        onClose: async () => await fetchRideData(),
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeButton: true,
      });
    }
  };

  return userType === "passenger" ? (
    <Card className="my-ride-card">
      <Card.Header className="d-flex justify-content-between">
        <div className="driver-info">
          <h3 className="body-bold-medium">{driver.name}</h3>
          <a className="body-xs">{driver.reviews_average}/5</a>
        </div>
        <div className="ride-price-box body-bold-medium">
          {reservation.price}мкд
        </div>
      </Card.Header>
      <Card.Body>
        <div className="d-flex destination-info justify-content-between">
          <div className="d-flex flex-column">
            <h4 className="heading-xs">{ride.from_location_name}</h4>
            <span className="body-bold-xs">{departureTime}</span>
          </div>
          <div className="d-flex flex-column pb-2">
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
        <div className="date-info justify-content-center d-flex">
          <Col xs={6} className="first d-flex justify-content-end px-3">
            <div>
              <span>Датум</span>
              <h4 className="body-bold-xs">{departureDate}</h4>
            </div>
          </Col>
          <Col xs={6} className="px-3">
            <span>Резервирани места</span>
            <h4 className="body-bold-xs">{reservation.num_seats} Место</h4>
          </Col>
        </div>

        {category === "R" && (
          <>
            <a
              href={`sms:${driver.phone_num}`}
              className="d-flex justify-content-between additional-actions"
            >
              <span className="body-bold-s">Пиши му на димитар</span>
              <img src="images/message-icon.svg" />
            </a>
            <div className="d-flex flex-column align-items-center confirmation-actions">
              <Button
                className="dark-button col-12 mt-4 arrived-button body-bold-medium"
                onClick={confirmArrival}
              >
                Стигнав
              </Button>
              <a className="body-bold-s">Превозот не се реализира</a>{" "}
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  ) : (
    <p>Driver</p>
  );
};

export default MyRideCard;
