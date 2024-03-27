const jwt = require("jsonwebtoken");

const dbCon = require("../db");

const locationsController = require("./geoLocationController");

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
      return res.status(401).json({ error: "Only drivers can post" });
    }
    if (requestedDateTime <= currentDateTime) {
      return res.status(400).json({
        error: "Invalid date_time: Date must be after current datetime",
      });
    }

    // Your SQL query to insert into rides table
    const sql = `INSERT INTO rides (driver_id, from_loc_id, to_loc_id, date_time, type, total_seats, price, car_model, car_color) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Execute the SQL query
    await dbCon.query(sql, [
      driverId,
      req.body.from_loc_id,
      req.body.to_loc_id,
      req.body.date_time,
      req.body.type,
      req.body.total_seats,
      req.body.price,
      req.body.car_model,
      req.body.car_color,
    ]);

    return res.status(201).json({ message: "Ride posted successfully" });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      // Token verification error
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
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
        .status(401)
        .json({ error: "Unauthorized: Only drivers can access their rides" });
    }

    // Your SQL query to fetch rides for the user
    const sql = `SELECT * FROM rides WHERE driver_id = ?`;

    // Execute the SQL query
    const [rides] = await dbCon.query(sql, [userId]);

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
        .status(401)
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
        .status(401)
        .json({ error: "There are already reservations for this ride" });
    }

    // Delete the ride from the database
    await dbCon.query("DELETE FROM rides WHERE id = ?", [rideId]);

    return res.status(200).json({ message: "Ride deleted successfully" });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      // Token verification error
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    } else {
      console.error("Error when deleting a ride:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

// General functions

async function searchForRides(req, res) {
  const { from_loc_id, to_loc_id, date_time } = req.query;

  try {
    // Get locations for from and to
    const fromLocation = await locationsController.getLocation(from_loc_id);
    const toLocation = await locationsController.getLocation(to_loc_id);

    // Your existing code for fetching rides remains unchanged
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
    `;

    const [rides] = await dbCon.query(sql, [
      from_loc_id,
      from_loc_id,
      to_loc_id,
      to_loc_id,
      date_time,
    ]);

    rides.forEach((ride) => {
      ride.from_location_name = ride.from_location_name;
      ride.to_location_name = ride.to_location_name;
    });

    return res.status(200).json(rides);
  } catch (error) {
    console.error("Error when retrieving rides:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { postRide, getMyRides, deleteRide, searchForRides };
