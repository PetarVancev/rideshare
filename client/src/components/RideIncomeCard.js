import React from "react";
import { Card } from "react-bootstrap";

const RideIncomeCard = ({ data, userType }) => {
  const departureDateTime = new Date(data.date_time);
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
  if (data.ride_duration) {
    const [rideDurationHours, rideDurationMinutes] = data.ride_duration
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

  let totalRideIncome = 0;

  if (data && data.transactions && data.transactions.length > 0) {
    data.transactions.forEach((transaction) => {
      totalRideIncome += transaction.amount;
    });
  }

  if (data) {
    return (
      <Card className="income-card mb-4">
        <Card.Body className={userType === "driver" ? "pb-0" : ""}>
          <div className="d-flex destination-info justify-content-between">
            <div className="d-flex flex-column">
              <h4 className="heading-xs">{data.from_location_name}</h4>
              <span className="body-bold-xs">22:00</span>
            </div>
            <div className="d-flex flex-column pb-2">
              <span className="text-center body-bold-xs">{rideDuration}</span>
              <img
                src="/images/journey-indicator-horizontal.svg"
                className="journey-indicator"
              />
            </div>
            <div className="d-flex flex-column">
              <h4 className="heading-xs">{data.to_location_name}</h4>
              <span className="body-bold-xs">{arrivalTime}</span>
            </div>
          </div>
          <div className="ride-income">
            <div className="d-flex justify-content-between total-ride-income align-items-center">
              <span className="body-bold-s">
                {userType == "driver" ? "Приливи" : "Платено"}
              </span>
              <span className="green-text btn-text-m">
                ден
                {userType == "driver"
                  ? totalRideIncome
                  : parseInt(data.amount / 0.75)}
              </span>
            </div>
            <div className="income-breakdown">
              {userType == "driver" &&
                data.transactions &&
                data.transactions.length > 0 &&
                data.transactions.map((transaction) => {
                  console.log(transaction); // Log the transaction to the console
                  return (
                    <div
                      className="d-flex justify-content-between"
                      key={transaction.id}
                    >
                      <span className="body-bold-s">
                        {transaction.from_passenger_name}
                      </span>
                      <span className="btn-text-m">
                        ден{transaction.amount}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  } else {
    return null;
  }
};

export default RideIncomeCard;
