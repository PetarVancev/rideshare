import React from "react";
import { Card, Button, Col } from "react-bootstrap";

const MyRideCard = ({ rideData }) => {
  const ride = rideData.ride;
  const reservation = rideData.reservation;
  const driver = rideData.driver;

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
  return (
    <Card className="my-ride-card">
      <Card.Header className="d-flex justify-content-between">
        <div className="driver-info">
          <h3 className="body-bold-medium">{driver.name}</h3>
          <a className="body-xs">4.8/5</a>
        </div>
        <div className="ride-price-box body-bold-medium">
          {reservation.price + "мкд"}
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
        <a
          href={`sms:${driver.phone_num}`}
          className="d-flex justify-content-between additional-actions"
        >
          <span className="body-bold-s">Пиши му на димитар</span>
          <img src="images/message-icon.svg" />
        </a>
        <div className="d-flex flex-column align-items-center confirmation-actions">
          <Button className="dark-button col-12 mt-4 arrived-button body-bold-medium">
            Стигнав
          </Button>
          <a href="#" className="body-bold-s">
            Превозот не се реализира
          </a>
        </div>
      </Card.Body>

      {/* <Button>Зачувај</Button> */}
    </Card>
  );
};

export default MyRideCard;
