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
    SELECT *
    FROM transactions
    WHERE ride_id = ? AND to_driver_id = ?
  `;
    if (userType == "driver" && !ridesController.isDriverAssociatedWithRide) {
      return res.status(403).json({
        error: "This ride does not belong to the current driver",
      });
    } else if (userType == "passenger") {
      query = `
    SELECT *
    FROM transactions
    WHERE ride_id = ? AND from_passenger_id = ?
  `;
    }

    const [transactions] = await dbCon.query(query, [rideId, userId]);
    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ error: "No transactions for provided ride" });
    }
    return res.status(200).json(transactions);
  } catch (error) {}
}

async function payToDriver(
  connection,
  fromPassenger,
  toDriver,
  rideId,
  amount
) {
  const percentWeCharge = 0.25;
  try {
    const getDriverBalanceQuery =
      "SELECT balance FROM driver_accounts WHERE id = ?";
    const [driver] = await connection.query(getDriverBalanceQuery, [toDriver]);

    if (driver.length === 0) {
      throw new Error("Driver not found");
    }

    amount = amount * (1 - percentWeCharge);
    const currentBalance = driver[0].balance;
    const newBalance = currentBalance + amount;

    const updateDriverBalanceQuery =
      "UPDATE driver_accounts SET balance = ? WHERE id = ?";
    await connection.query(updateDriverBalanceQuery, [newBalance, toDriver]);

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

module.exports = { payToDriver, getTransactionsForRide };
