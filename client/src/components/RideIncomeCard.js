import React from "react";
import { Card } from "react-bootstrap";

const RideIncomeCard = ({ data, userType }) => {
  const departureDateTime = new Date(data.date_time);
  const departureDate = departureDateTime.toLocaleDateString("en-GB");
  const departureTime = departureDateTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let arrivalDateTime = new Date(departureDateTime);
  let arrivalDate = "";
  let arrivalTime = "";
  let rideDuration = "";

  if (data.ride_duration) {
    const [rideDurationHours, rideDurationMinutes] = data.ride_duration
      .split(":")
      .map(Number);

    const totalRideMinutes = rideDurationHours * 60 + rideDurationMinutes;
    let totalArrivalMinutes =
      departureDateTime.getHours() * 60 +
      departureDateTime.getMinutes() +
      totalRideMinutes;

    if (totalArrivalMinutes >= 24 * 60) {
      arrivalDateTime.setDate(arrivalDateTime.getDate() + 1);
      totalArrivalMinutes -= 24 * 60;
    }

    arrivalDateTime.setHours(Math.floor(totalArrivalMinutes / 60));
    arrivalDateTime.setMinutes(totalArrivalMinutes % 60);

    arrivalDate = arrivalDateTime.toLocaleDateString("en-GB");
    arrivalTime = arrivalDateTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

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
              <h4 className="heading-xs">{data.to_location_name}</h4>
              <span className="body-bold-xs">{arrivalTime}</span>
            </div>
          </div>

          <div className="ride-income">
            <div className="d-flex justify-content-between total-ride-income align-items-center">
              <span className="body-bold-s">
                {userType === "driver"
                  ? `Income${data.cash_payment ? " (Cash)" : ""}`
                  : `Paid${data.cash_payment ? " (Cash)" : ""}`}
              </span>
              <span className="green-text btn-text-m">
                {userType === "driver"
                  ? totalRideIncome
                  : data.cash_payment
                  ? data.amount
                  : data.price}{" "}
                currency
              </span>
            </div>

            <div className="income-breakdown">
              {userType === "driver" &&
                data.transactions &&
                data.transactions.length > 0 &&
                data.transactions.map((transaction) => {
                  console.log(transaction);
                  return (
                    <div
                      className="d-flex justify-content-between"
                      key={transaction.id}
                    >
                      <span className="body-bold-s">
                        {transaction.from_passenger_name}
                      </span>
                      <span className="btn-text-m">
                        {transaction.amount} currency
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
