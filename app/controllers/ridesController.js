const jwt = require("jsonwebtoken");

const dbCon = require("../db");

const locationsController = require("./geoLocationController");
const reviewsController = require("./reviewsController");

async function isDriverAssociatedWithRide(driverId, rideId) {
  const checkDriverQuery = `
    SELECT COUNT(*) AS count
    FROM rides r
    WHERE r.driver_id = ? AND r.id = ?;
  `;
  const [result] = await dbCon.query(checkDriverQuery, [driverId, rideId]);
  return result[0].count > 0;
}

async function getRide(connection, rideId) {
  try {
    const rideSql = `
      SELECT rides.*, from_location.name AS from_name, to_location.name AS to_name
      FROM rides
      INNER JOIN locations AS from_location ON rides.from_loc_id = from_location.id
      INNER JOIN locations AS to_location ON rides.to_loc_id = to_location.id
      WHERE rides.id = ?
      LIMIT 1;
    `;
    const [ride] = await connection.query(rideSql, [rideId]);

    if (ride.length === 0) {
      return null; // Ride not found
    }

    return ride[0];
  } catch (error) {
    console.error("Error when retrieving ride info:", error);
    return null; // Return null indicating failure
  }
}

async function getReservationsForRide(rideId) {
  const sql = `
      SELECT r.*, p.name, p.phone_num
      FROM reservations r
      INNER JOIN passenger_accounts p ON r.passenger_id = p.id
      WHERE r.ride_id = ?
    `;

  // Execute the SQL query
  const [reservations] = await dbCon.query(sql, [rideId]);

  return reservations;
}

// Driver functions
async function postRide(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract from the decoded token
    const userType = decoded.userType;
    const driverId = decoded.userId;
    const requestedDateTime = new Date(req.body.date_time);

    const currentDateTime = new Date();

    if (userType != "driver") {
      return res.status(403).json({ error: "Only drivers can post" });
    }
    if (requestedDateTime <= currentDateTime) {
      return res.status(400).json({
        error: "Invalid date_time: Date must be after current datetime",
      });
    }

    let flexibleDeparture = req.body.flexible_departure;
    if (flexibleDeparture === undefined) {
      flexibleDeparture = false;
    }
    let flexibleArrival = req.body.flexible_arrival;
    if (flexibleArrival === undefined) {
      flexibleArrival = false;
    }

    let type = "I";
    if (flexibleDeparture || flexibleArrival) {
      type = "C";
    }

    // Your SQL query to insert into rides table
    const sql = `INSERT INTO rides (driver_id, from_loc_id, to_loc_id, date_time,ride_duration, type,flexible_departure, flexible_arrival, total_seats, price, additional_info, car_model, car_color) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    // Execute the SQL query
    await dbCon.query(sql, [
      driverId,
      req.body.from_loc_id,
      req.body.to_loc_id,
      req.body.date_time,
      req.body.ride_duration,
      type,
      flexibleDeparture,
      flexibleArrival,
      req.body.total_seats,
      req.body.price,
      req.body.additional_info,
      req.body.car_model,
      req.body.car_color,
    ]);

    return res.status(201).json({ message: "Ride posted successfully" });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or expired token" });
    } else {
      console.error("Error when posting a ride:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

async function getMyRides(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const userType = decoded.userType;

    if (userType !== "driver") {
      return res
        .status(403)
        .json({ error: "Unauthorized: Only drivers can access their rides" });
    }

    // Your SQL query to fetch rides for the user
    let sql = `SELECT * FROM rides WHERE driver_id = ?`;

    // Check if query parameter is set to 'C', and if so, filter rides after current date time
    const status = req.query.status;
    const currentTime = new Date().toISOString();
    if (status && status === "C") {
      sql += ` AND date_time < ? ORDER BY date_time DESC`;
    } else {
      sql += ` AND date_time > ? ORDER BY date_time DESC`;
    }

    // Execute the SQL query without filtering by date
    const [rides] = await dbCon.query(sql, [userId, currentTime]);

    // Fetch reservations for each ride
    for (const ride of rides) {
      ride.reservations = await getReservationsForRide(ride.id);
      const from_location = await locationsController.getLocation(
        ride.from_loc_id
      );
      ride.from_location_name = from_location[0].name;
      const to_location = await locationsController.getLocation(ride.to_loc_id);
      ride.to_location_name = to_location[0].name;
    }

    return res.status(200).json(rides);
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      // Token verification error
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    } else {
      console.error("Error when getting user's rides:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

async function deleteRide(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const userType = decoded.userType;

    if (userType !== "driver") {
      return res
        .status(403)
        .json({ error: "Unauthorized: Only drivers can delete rides" });
    }

    const rideId = req.params.rideId; // Assuming the ride ID is passed in the URL params

    // Check if the ride belongs to the driver
    const [ride] = await dbCon.query(
      "SELECT total_seats,free_seats FROM rides WHERE id = ? AND driver_id = ?",
      [rideId, userId]
    );

    if (ride.length === 0) {
      return res
        .status(404)
        .json({ error: "Ride not found or does not belong to the driver" });
    } else if (ride.total_seats != ride.free_seats) {
      return res
        .status(403)
        .json({ error: "There are already reservations for this ride" });
    }

    // Delete the ride from the database
    await dbCon.query("DELETE FROM rides WHERE id = ?", [rideId]);

    return res.status(200).json({ message: "Ride deleted successfully" });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or expired token" });
    } else {
      console.error("Error when deleting a ride:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

// General functions

async function searchForRides(req, res) {
  const { from_loc_id, to_loc_id, date_time, seats, sortBy, timeRange } =
    req.query;

  try {
    if (!from_loc_id || !to_loc_id || !date_time || !seats) {
      return res.status(404);
    }

    let orderByClause = "";
    let timeRangeCondition = "";

    if (sortBy === "price") {
      orderByClause = "ORDER BY r.price ASC";
    } else {
      orderByClause = "ORDER BY r.date_time ASC";
    }
    console.log(timeRange);
    if (timeRange) {
      const [start, end] = timeRange.split("-");
      startTime = start.trim();
      endTime = end.trim();

      timeRangeCondition = `
        AND 
        TIME(r.date_time) >= ?
        AND 
        TIME(r.date_time) <= ?`;
    }

    const sql = `
      SELECT 
        r.id, 
        r.driver_id, 
        r.from_loc_id, 
        r.to_loc_id, 
        r.date_time, 
        r.ride_duration,
        r.total_seats, 
        r.free_seats, 
        r.price, 
        r.car_model, 
        r.car_color, 
        d.name AS driver_name,
        d.id AS driver_id, 
        from_loc.name AS from_location_name, 
        to_loc.name AS to_location_name
      FROM 
        rides AS r
      JOIN 
        driver_accounts AS d ON r.driver_id = d.id
      JOIN 
        locations AS from_loc ON r.from_loc_id = from_loc.id
      JOIN 
        locations AS to_loc ON r.to_loc_id = to_loc.id
      WHERE 
        (r.from_loc_id = ? OR r.from_loc_id IN (SELECT id FROM locations WHERE parent_location_id = ?)) 
        AND 
        (r.to_loc_id = ? OR r.to_loc_id IN (SELECT id FROM locations WHERE parent_location_id = ?))
        AND 
        DATE(r.date_time) = ?
        AND 
        r.free_seats >= ?
        ${timeRangeCondition} 
        ${orderByClause};
    `;

    const [rides] = await dbCon.query(sql, [
      from_loc_id,
      from_loc_id,
      to_loc_id,
      to_loc_id,
      date_time,
      seats,
      startTime,
      endTime,
    ]);

    const driverAverageReviewsPromises = rides.map(async (ride) => {
      ride.driver_average_review =
        await reviewsController.getDriverReviewsAverage(ride.driver_id);
    });

    await Promise.all(driverAverageReviewsPromises);

    return res.status(200).json(rides);
  } catch (error) {
    console.error("Error when retrieving rides:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getRideInfo(req, res) {
  const rideId = req.query.rideId;

  try {
    const rideSql = `
    SELECT 
        r.id, 
        r.driver_id, 
        r.date_time,
        r.type,
        r.flexible_departure,
        r.flexible_arrival,  
        r.ride_duration,
        r.total_seats, 
        r.free_seats, 
        r.price, 
        r.car_model, 
        r.car_color,
        r.additional_info,
        d.name AS driver_name, 
        from_loc.name AS from_location_name, 
        from_loc.location_lat as from_location_lat,
        from_loc.location_lon as from_location_lon,
        to_loc.name AS to_location_name,
        to_loc.location_lat as to_location_lat,
        to_loc.location_lon as to_location_lon,
        ROUND((
            (SELECT AVG(dr.time_correctness_score) FROM ride_reviews AS dr WHERE dr.driver_id = r.driver_id) +
            (SELECT AVG(dr.safety_score) FROM ride_reviews AS dr WHERE dr.driver_id = r.driver_id) +
            (SELECT AVG(dr.comfort_score) FROM ride_reviews AS dr WHERE dr.driver_id = r.driver_id)
        ) / 3, 1) AS average_rating
    FROM 
        rides AS r
    JOIN 
        driver_accounts AS d ON r.driver_id = d.id
    JOIN 
        locations AS from_loc ON r.from_loc_id = from_loc.id
    JOIN 
        locations AS to_loc ON r.to_loc_id = to_loc.id
    WHERE 
        r.id = ?
    LIMIT 1;
`;
    const [ride] = await dbCon.query(rideSql, [rideId]);

    if (ride.length === 0) {
      return res.status(404).json({ error: "Ride not found" });
    }

    const driverReviewsSql = `
    SELECT r.text, r.time_correctness_score, r.safety_score, r.comfort_score, r.date_time, p.name
    FROM ride_reviews r
    INNER JOIN passenger_accounts p ON r.passenger_id = p.id
    WHERE driver_id = ?
    ORDER BY date_time DESC
    LIMIT 3;
`;
    const [driverReviews] = await dbCon.query(driverReviewsSql, [
      ride[0].driver_id,
    ]);

    const rideInfo = {
      id: ride[0].id,
      driver_id: ride[0].driver_id,
      type: ride[0].type,
      flexibleDeparture: ride[0].flexible_departure,
      flexibleArrival: ride[0].flexible_arrival,
      date_time: ride[0].date_time,
      ride_duration: ride[0].ride_duration,
      total_seats: ride[0].total_seats,
      free_seats: ride[0].free_seats,
      price: ride[0].price,
      car_model: ride[0].car_model,
      car_color: ride[0].car_color,
      additional_info: ride[0].additional_info,
      driver_name: ride[0].driver_name,
      from_location_name: ride[0].from_location_name,
      from_location_cord: {
        lat: ride[0].from_location_lat,
        lng: ride[0].from_location_lon,
      },
      to_location_name: ride[0].to_location_name,
      to_location_cord: {
        lat: ride[0].to_location_lat,
        lng: ride[0].to_location_lon,
      },
      average_rating: ride[0].average_rating ? ride[0].average_rating : 0.0,
      driver_reviews: driverReviews,
    };

    return res.status(200).json(rideInfo);
  } catch (error) {
    console.error("Error when retrieving ride info:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  postRide,
  getMyRides,
  deleteRide,
  searchForRides,
  getRideInfo,
  getRide,
  isDriverAssociatedWithRide,
};
