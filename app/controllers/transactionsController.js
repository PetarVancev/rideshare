const dbCon = require("../db");
const jwt = require("jsonwebtoken");

const ridesController = require("./ridesController");

async function getTransactionsForRide(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const userType = decoded.userType;

    const rideId = req.query.rideId;

    let query = `
    SELECT transactions.*, passenger_accounts.name AS from_passenger_name
    FROM transactions
    INNER JOIN passenger_accounts ON transactions.from_passenger_id = passenger_accounts.id
    WHERE ride_id = ? AND to_driver_id = ?    
  `;
    if (userType == "driver" && !ridesController.isDriverAssociatedWithRide) {
      return res.status(403).json({
        error: "This ride does not belong to the current driver",
      });
    } else if (userType == "passenger") {
      return res.status(403).json({ error: "This is an endpoint for drivers" });
    }

    const [transactions] = await dbCon.query(query, [rideId, userId]);
    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ error: "No transactions for provided ride" });
    }
    return res.status(200).json(transactions);
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or expired token" });
    } else {
      console.error("Error when getting transactions for ride:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

async function getPassengerTransactions(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const userType = decoded.userType;

    let query = `
    SELECT transactions.*,fromLocation.name AS from_location_name, toLocation.name AS to_location_name,rides.date_time,rides.ride_duration, rides.price, rides.cash_payment
    FROM transactions
    INNER JOIN rides ON transactions.ride_id = rides.id
    INNER JOIN locations AS fromLocation ON rides.from_loc_id = fromLocation.id
    INNER JOIN locations AS toLocation ON rides.to_loc_id = toLocation.id
    WHERE transactions.from_passenger_id = ?
  `;
    if (userType == "driver") {
      return res.status(403).json({
        error: "This endpoint is only for passengers",
      });
    }

    const [transactions] = await dbCon.query(query, [userId]);
    if (transactions.length === 0) {
      return res.status(404).json({ error: "No transactions found" });
    }

    return res.status(200).json(transactions);
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or expired token" });
    } else {
      console.error("Error when getting passenger transactions:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

async function payToDriver(
  connection,
  fromPassenger,
  toDriver,
  rideId,
  amount,
  cash_payment
) {
  const percentWeCharge = 0.2;
  try {
    const status = getReservationStatus(connection, reservationId);
    const getDriverBalanceQuery =
      "SELECT balance FROM driver_accounts WHERE id = ?";
    const [driver] = await connection.query(getDriverBalanceQuery, [toDriver]);

    if (driver.length === 0) {
      throw new Error("Driver not found");
    }

    if (!cash_payment) {
      amount = amount * (1 - percentWeCharge);
    } else {
      amount = amount + 40;
    }
    const currentBalance = driver[0].balance;
    const newBalance = currentBalance + amount;

    if (!cash_payment) {
      const updateDriverBalanceQuery =
        "UPDATE driver_accounts SET balance = ? WHERE id = ?";
      await connection.query(updateDriverBalanceQuery, [newBalance, toDriver]);
    }

    const currentDateTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const insertTransactionQuery =
      "INSERT INTO transactions (from_passenger_id, to_driver_id, ride_id, amount, date_time) VALUES (?, ?, ?, ?, ?)";
    await connection.query(insertTransactionQuery, [
      fromPassenger,
      toDriver,
      rideId,
      amount,
      currentDateTime,
    ]);
  } catch (error) {
    throw new Error(
      `Error while processing payment to driver: ${error.message}`
    );
  }
}

module.exports = {
  payToDriver,
  getTransactionsForRide,
  getPassengerTransactions,
};
