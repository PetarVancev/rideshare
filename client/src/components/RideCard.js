import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RideCard = ({ ride, seats }) => {
  const navigate = useNavigate();

  const departureDateTime = new Date(ride.date_time);
  const departureDate = departureDateTime.toLocaleDateString("en-GB");
  const departureTime = departureDateTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let arrivalDateTime = new Date(departureDateTime); // Initialize with departure datetime
  let arrivalDate = ""; // Initialize arrival date string
  let arrivalTime = ""; // Initialize arrival time string
  let rideDuration = ""; // Initialize ride duration string

  if (ride.ride_duration) {
    const [rideDurationHours, rideDurationMinutes] = ride.ride_duration
      .split(":")
      .map(Number);

    // Calculate total minutes for ride duration
    const totalRideMinutes = rideDurationHours * 60 + rideDurationMinutes;

    // Calculate total minutes for arrival time
    let totalArrivalMinutes =
      departureDateTime.getHours() * 60 +
      departureDateTime.getMinutes() +
      totalRideMinutes;

    // Adjust date if arrival time exceeds 24 hours
    if (totalArrivalMinutes >= 24 * 60) {
      arrivalDateTime.setDate(arrivalDateTime.getDate() + 1);
      totalArrivalMinutes -= 24 * 60;
    }

    // Set arrival time
    arrivalDateTime.setHours(Math.floor(totalArrivalMinutes / 60));
    arrivalDateTime.setMinutes(totalArrivalMinutes % 60);

    // Format arrival date
    arrivalDate = arrivalDateTime.toLocaleDateString("en-GB");

    // Format arrival time
    arrivalTime = arrivalDateTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Format ride duration
    rideDuration = `${rideDurationHours
      .toString()
      .padStart(2, "0")}:${rideDurationMinutes.toString().padStart(2, "0")}`;
  }

  return (
    <Card className="ride-result-card">
      <Card.Header className="d-flex justify-content-between">
        <div className="driver-info">
          <h3 className="body-bold-medium">{ride.driver_name}</h3>
          <a className="body-xs">{ride.driver_average_review}/5</a>
        </div>
        <div className="ride-price-box body-bold-medium">
          {ride.price * seats + "мкд"}
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
              <span className="body-bold-xs blue-text">{rideDuration}</span>
            </div>
          </div>
        </div>
      </Card.Body>
      {/* <Button>Зачувај</Button> */}
      <Button
        className="dark-button col-12 mt-4 reserve-button"
        onClick={() => {
          navigate(`/ride-info?rideId=${ride.id}&seats=${seats}`);
        }}
      >
        Повеќе
      </Button>
    </Card>
  );
};

export default RideCard;
