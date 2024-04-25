const jwt = require("jsonwebtoken");
const dbCon = require("../db");

async function getReservationStatus(passengerId, reservationId) {
  const checkReservationQuery =
    "SELECT status FROM reservations WHERE id = ? AND passenger_id = ?";
  return await dbCon.query(checkReservationQuery, [reservationId, passengerId]);
}

async function getRideIdFromReservation(reservationId) {
  const getRideIdQuery = "SELECT ride_id FROM reservations WHERE id = ?";
  const [result] = await dbCon.query(getRideIdQuery, [reservationId]);
  const rideId = result[0].ride_id;

  return rideId;
}

async function insertComplaint(connection, passengerId, rideId, text) {
  const insertComplaintQuery =
    "INSERT INTO complaints (passenger_id, ride_id, text) VALUES (?, ?, ?)";

  await connection.query(insertComplaintQuery, [passengerId, rideId, text]);
}

async function updateReservationStatus(connection, reservationId, status) {
  const updateStatusQuery = "UPDATE reservations SET status = ? WHERE id = ?";
  await connection.query(updateStatusQuery, [status, reservationId]);
}

async function checkComplaintExistenceForRideByPassenger(rideId, passengerId) {
  const countComplaintsQuery =
    "SELECT COUNT(*) AS count FROM complaints WHERE ride_id = ? AND passenger_id = ?";
  const [result] = await dbCon.query(countComplaintsQuery, [
    rideId,
    passengerId,
  ]);
  const complaintCount = result[0].count;
  return complaintCount > 0;
}

async function sendComplaint(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    connection = await dbCon.getConnection();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userType = decoded.userType;
    const passengerId = decoded.userId;

    const reservationId = req.body.reservationId;
    const text = req.body.text;

    if (userType !== "passenger") {
      return res
        .status(403)
        .json({ error: "Only passengers can write complaints" });
    }

    const reservationStatusResults = await getReservationStatus(
      passengerId,
      reservationId
    );

    if (reservationStatusResults.length === 0) {
      return res.status(403).json({
        error: "Passenger does not have a reservation for the provided ride",
      });
    }

    const reservationStatus = reservationStatusResults[0][0].status;

    if (reservationStatus !== "R") {
      return res.status(403).json({
        error:
          "Complaints can only be submitted for reservations with status 'R'",
      });
    }

    const rideId = await getRideIdFromReservation(reservationId);

    const hasComplaint = await checkComplaintExistenceForRideByPassenger(
      rideId,
      passengerId
    );

    if (hasComplaint) {
      return res.status(409).json({
        error: "You have already written a complaint for this ride",
      });
    }

    await connection.beginTransaction();

    await insertComplaint(connection, passengerId, rideId, text);

    await updateReservationStatus(connection, reservationId, "I");

    await connection.commit();

    return res.status(200).json({ message: "Complaint sent successfully" });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or expired token" });
    } else {
      console.error("Error when sending complaint:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function getAllComplaints(req, res) {
  try {
    const getAllComplaintsQuery = "SELECT * FROM complaints";
    const [complaints] = await dbCon.query(getAllComplaintsQuery);
    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error while fetching complaints:", error);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
}

module.exports = { sendComplaint, getAllComplaints };
