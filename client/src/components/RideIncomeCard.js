import React from "react";
import { Card } from "react-bootstrap";

const RideIncomeCard = ({ data, userType }) => {
  const departureDateTime = new Date(data.date_time);
  const departureDate = departureDateTime.toLocaleDateString("en-GB");
  const departureTime = departureDateTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let arrivalDateTime = new Date(departureDateTime); // Initialize with departure datetime
  let arrivalDate = ""; // Initialize arrival date string
  let arrivalTime = ""; // Initialize arrival time string
  let rideDuration = ""; // Initialize ride duration string

  if (data.ride_duration) {
    const [rideDurationHours, rideDurationMinutes] = data.ride_duration
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

  let totalRideIncome = 0;

  if (data && data.transactions && data.transactions.length > 0) {
    data.transactions.forEach((transaction) => {
      totalRideIncome += transaction.amount;
    });
  }

  if (data) {
    console.log(data);
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
                {userType == "driver"
                  ? `Приливи${data.cash_payment ? " во кеш" : ""}`
                  : `Платено${data.cash_payment ? " во кеш" : ""}`}
              </span>
              <span className="green-text btn-text-m">
                ден
                {userType == "driver"
                  ? totalRideIncome
                  : data.cash_payment
                  ? data.amount
                  : data.price}
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
