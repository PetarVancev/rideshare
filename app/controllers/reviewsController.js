const jwt = require("jsonwebtoken");

const dbCon = require("../db");

async function getDriverReviewsAverage(driverId) {
  try {
    const sql = `
      SELECT 
        ROUND(AVG((time_correctness_score + safety_score + comfort_score) / 3),1) AS average_score
      FROM 
        ride_reviews
      WHERE 
        driver_id = ?
    `;
    const [result] = await dbCon.query(sql, [driverId]);

    const averageScore =
      result[0].average_score !== null ? result[0].average_score : 0.0;

    return averageScore;
  } catch (error) {
    console.error("Error when getting driver's reviews:", error);
    throw new Error("Internal Server Error");
  }
}

async function getReviews(req, res) {
  const driverId = req.query.driverId;

  try {
    const sql = `
      SELECT r.*, p.name 
      FROM ride_reviews r
      INNER JOIN passenger_accounts p ON r.passenger_id = p.id
      WHERE r.driver_id = ?`;
    const [reviews] = await dbCon.query(sql, [driverId]);

    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for the user" });
    }

    const averageScore = await getDriverReviewsAverage(driverId);

    return res.status(200).json({ reviews, averageScore });
  } catch (error) {
    console.error("Error when getting driver's reviews:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function postReview(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const userType = decoded.userType;

    if (userType != "passenger") {
      return res
        .status(403)
        .json({ error: "Only passengers can write reviews" });
    }
    const {
      rideId,
      time_correctness_score,
      safety_score,
      comfort_score,
      text,
    } = req.body;

    const reservation = await getReservation(userId, rideId);
    if (!reservation || reservation.status !== "C") {
      return res.status(403).json({
        error: "You can't post a review for a ride that you haven't been in",
      });
    }

    // Check if the user already has a review for the ride
    const existingReview = await getMyReview(userId, rideId);
    if (existingReview) {
      return res
        .status(403)
        .json({ error: "You have already posted a review for this ride" });
    }

    // Post the review
    const currentDateTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    await insertReview(
      userId,
      rideId,
      time_correctness_score,
      safety_score,
      comfort_score,
      text,
      currentDateTime
    );

    return res.status(201).json({ message: "Review posted successfully" });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or expired token" });
    }
    console.error("Error when posting ride review:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getReservation(userId, rideId) {
  const sql =
    "SELECT * FROM reservations WHERE passenger_id = ? AND ride_id = ?";
  const [reservations] = await dbCon.query(sql, [userId, rideId]);
  return reservations[0];
}

async function getMyReview(userId, rideId) {
  const sql =
    "SELECT * FROM ride_reviews WHERE passenger_id = ? AND ride_id = ?";
  const [reviews] = await dbCon.query(sql, [userId, rideId]);
  return reviews[0];
}

async function insertReview(
  userId,
  rideId,
  time_correctness_score,
  safety_score,
  comfort_score,
  text,
  dateTime
) {
  const findDriverQuery = "SELECT driver_id FROM rides WHERE id = ?";
  const [driverResults] = await dbCon.query(findDriverQuery, [rideId]);
  if (driverResults.length == 0) {
    throw new Error("No ride with the provided id");
  } else {
    const driverId = driverResults[0].driver_id;
    await dbCon.query(
      "INSERT INTO ride_reviews (driver_id, passenger_id, ride_id, date_time, time_correctness_score, safety_score, comfort_score, text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        driverId,
        userId,
        rideId,
        dateTime,
        time_correctness_score,
        safety_score,
        comfort_score,
        text,
      ]
    );
  }
}

module.exports = { postReview, getReviews, getDriverReviewsAverage };
