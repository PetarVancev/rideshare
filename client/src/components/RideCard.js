import React from "react";
import { Card, Button } from "react-bootstrap";

const RideCard = ({ ride }) => {
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
    <Card className="ride-result-card">
      <Card.Header className="d-flex justify-content-between">
        <div className="driver-info">
          <h3 className="body-bold-medium">{ride.driver_name}</h3>
          <a className="body-xs">4.8/5</a>
        </div>
        <div className="ride-price-box body-bold-medium">
          {ride.price + "мкд"}
        </div>
      </Card.Header>
      <Card.Body className="d-flex justify-content-between">
        <div className="d-flex destination-info">
          <img
            src="/images/journey-indicator.svg"
            className="journey-indicator"
          />
          <div className="d-flex flex-column justify-content-between">
            <div className="d-flex flex-column justify-content-start">
              <h4 className="journey-location body-bold-xs">
                {ride.from_location_name}
              </h4>
              <span>{departureTime}</span>
            </div>
            <div className="d-flex flex-column justify-content-end">
              <h4 className="journey-location body-bold-xs">
                {ride.to_location_name}
              </h4>
              <span>{arrivalTime}</span>
            </div>
          </div>
        </div>
        <div className="time-info">
          <div className="d-flex justify-content-start border-bot">
            <div className="departure-info">
              <h4 className="body-bold-xs">Поаѓање</h4>
              <span className="body-bold-xs">{departureTime}</span>
            </div>
            <div className="travel-time">
              <h4 className="body-bold-xs">Време на патување</h4>
              <span className="body-bold-xs">{rideDuration}</span>
            </div>
          </div>
        </div>
      </Card.Body>
      {/* <Button>Зачувај</Button> */}
      <Button className="dark-button col-12 mt-4 reserve-button">
        Резервирај
      </Button>
    </Card>
  );
};

export default RideCard;
