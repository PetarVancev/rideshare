const jwt = require("jsonwebtoken");
const dbCon = require("../db");

const transactionsController = require("./transactionsController");

async function checkReservationOwnership(
  connection,
  reservationId,
  passengerId
) {
  const checkReservationQuery =
    "SELECT COUNT(*) AS count FROM reservations WHERE id = ? AND passenger_id = ?";
  const [result] = await connection.query(checkReservationQuery, [
    reservationId,
    passengerId,
  ]);
  return result[0].count > 0;
}

async function updateReservationStatus(connection, reservationId) {
  const updateReservationQuery =
    "UPDATE reservations SET status = 'C' WHERE id = ?";
  await connection.query(updateReservationQuery, [reservationId]);
}

async function getRideAndDriverDetails(connection, reservationId) {
  const getRideAndDriverQuery = `
    SELECT r.driver_id, r.id AS ride_id, d.balance AS driver_balance, r.price, rs.num_seats
    FROM reservations rs
    INNER JOIN rides r ON rs.ride_id = r.id
    INNER JOIN driver_accounts d ON r.driver_id = d.id
    WHERE rs.id = ?
  `;
  const [rideAndDriver] = await connection.query(getRideAndDriverQuery, [
    reservationId,
  ]);
  return rideAndDriver.length > 0 ? rideAndDriver[0] : null;
}

async function checkRideExistence(connection, rideId) {
  const checkRideQuery = "SELECT free_seats FROM rides WHERE id = ?";
  const [rideRows] = await connection.query(checkRideQuery, [rideId]);
  return rideRows.length > 0 ? rideRows[0] : null;
}

async function getPassengerBalance(connection, passengerId) {
  const checkBalanceQuery =
    "SELECT balance FROM passenger_accounts WHERE id = ?";
  const [passengerRows] = await connection.query(checkBalanceQuery, [
    passengerId,
  ]);
  return passengerRows.length > 0 ? passengerRows[0] : null;
}

async function updateBalance(connection, passengerId, newBalance) {
  const updateBalanceQuery =
    "UPDATE passenger_accounts SET balance = ? WHERE id = ?";
  await connection.query(updateBalanceQuery, [newBalance, passengerId]);
}

async function updateFreeSeats(connection, rideId, newFreeSeats) {
  const updateFreeSeatsQuery = "UPDATE rides SET free_seats = ? WHERE id = ?";
  await connection.query(updateFreeSeatsQuery, [newFreeSeats, rideId]);
}

async function getLocationInfo(connection, locationId) {
  const selectLocationQuery =
    "SELECT location_lat, location_lon FROM locations WHERE id = ?";
  const [locationRows] = await connection.query(selectLocationQuery, [
    locationId,
  ]);
  return locationRows.length > 0 ? locationRows[0] : null;
}

async function insertReservation(
  connection,
  rideId,
  passengerId,
  seatsNeeded,
  locationLat,
  locationLon
) {
  const insertReservationQuery =
    "INSERT INTO reservations (ride_id, passenger_id, num_seats, status, pick_up_lat, pick_up_lon) VALUES (?, ?, ?, 'R', ?, ?)";
  await connection.query(insertReservationQuery, [
    rideId,
    passengerId,
    seatsNeeded,
    locationLat,
    locationLon,
  ]);
}

async function isDriverAssociatedWithReservation(driverId, reservationId) {
  const checkDriverQuery = `
    SELECT COUNT(*) AS count
    FROM rides r
    INNER JOIN reservations rs ON r.id = rs.ride_id
    WHERE r.driver_id = ? AND rs.id = ?;
  `;
  const [result] = await dbCon.query(checkDriverQuery, [
    driverId,
    reservationId,
  ]);
  return result[0].count > 0;
}

async function updateDriverLocationAndStatus(
  latitude,
  longitude,
  reservationId
) {
  const updateQuery = `
    UPDATE reservations
    SET driver_lat = ?, driver_lon = ?, driver_arrived = true
    WHERE id = ?;
  `;

  await dbCon.query(updateQuery, [latitude, longitude, reservationId]);
}

function isValidCoordinates(lat, lon) {
  if (!lat || !lon) {
    return false;
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  console.log(latitude);
  console.log(longitude);

  if (isNaN(latitude) || isNaN(longitude)) {
    return false;
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return false;
  }

  const latStr = lat.toString();
  const lonStr = lon.toString();
  if (
    !hasMinimumDecimalPlaces(latStr, 5) ||
    !hasMinimumDecimalPlaces(lonStr, 5)
  ) {
    return false;
  }

  return true;
}

function hasMinimumDecimalPlaces(str, minDecimals) {
  const decimalIndex = str.indexOf(".");
  if (decimalIndex === -1) {
    return false;
  }

  const decimalPartLength = str.length - 1 - decimalIndex;
  return decimalPartLength >= minDecimals;
}

async function instantReserve(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  let connection;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userType = decoded.userType;
    const passengerId = decoded.userId;

    const rideId = req.query.rideId;
    const seatsNeeded = req.query.seats;

    if (seatsNeeded < 1) {
      return res
        .status(403)
        .json({ error: "You can't reserve less than 1 seat" });
    }

    if (userType !== "passenger") {
      return res
        .status(403)
        .json({ error: "Only passengers can reserve seats" });
    }

    connection = await dbCon.getConnection();
    await connection.beginTransaction();

    const ride = await checkRideExistence(connection, rideId);

    if (!ride) {
      await connection.rollback();
      return res.status(404).json({ error: "Ride not found" });
    }

    if (ride.free_seats < seatsNeeded) {
      await connection.rollback();
      return res
        .status(403)
        .json({ error: "Not enough seats", freeSeats: ride.free_seats });
    }

    const passenger = await getPassengerBalance(connection, passengerId);

    if (!passenger) {
      await connection.rollback();
      return res.status(404).json({ error: "Passenger not found" });
    }

    const currentBalance = passenger.balance;
    const newBalance = currentBalance - ride.price * seatsNeeded;

    if (newBalance < 0) {
      return res.status(402).json({
        message: `Insufficient balance, you need ${-newBalance} more funds`,
      });
    }

    await updateBalance(connection, passengerId, newBalance);
    await updateFreeSeats(connection, rideId, ride.free_seats - seatsNeeded);

    const location = await getLocationInfo(connection, ride.from_loc_id);

    if (!location) {
      await connection.rollback();
      return res.status(404).json({ error: "Location not found" });
    }

    await insertReservation(
      connection,
      rideId,
      passengerId,
      seatsNeeded,
      location.location_lat,
      location.location_lon
    );

    await connection.commit();

    return res.status(201).json({ message: "Reservation successful" });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    } else {
      console.error("Error when reserving ride:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function confirmArrival(req, res) {
  let connection = null;
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userType = decoded.userType;
    const passengerId = decoded.userId;

    const reservationId = req.query.reservationId;

    if (userType !== "passenger") {
      return res
        .status(403)
        .json({ error: "Only passengers can confirm arrival" });
    }

    connection = await dbCon.getConnection();
    await connection.beginTransaction();

    const isReservationValid = await checkReservationOwnership(
      connection,
      reservationId,
      passengerId
    );

    if (!isReservationValid) {
      await connection.rollback();
      return res.status(403).json({
        error: "This reservation does not belong to the current passenger",
      });
    }

    await updateReservationStatus(connection, reservationId);

    const rideAndDriver = await getRideAndDriverDetails(
      connection,
      reservationId
    );

    if (!rideAndDriver) {
      await connection.rollback();
      return res.status(404).json({ error: "Reservation not found" });
    }

    const { driver_id, ride_id, price, num_seats } = rideAndDriver;

    const amount = price * num_seats;

    await transactionsController.payToDriver(
      connection,
      passengerId,
      driver_id,
      ride_id,
      amount
    );

    await connection.commit();
    connection.release();

    return res
      .status(200)
      .json({ message: "Arrival confirmed and money sent to driver" });
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }

    console.error("Error when confirming arrival:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getMyReservations(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const userType = decoded.userType;
  const passengerId = decoded.userId;

  if (userType !== "passenger") {
    return res
      .status(403)
      .json({ error: "Only passengers can view reservations" });
  }

  try {
    let status = req.query.status || "";
    let statusFilter = "";

    if (status) {
      statusFilter = ` AND status = '${status}'`;
    }

    const getReservationsQuery = `
      SELECT 
        reservations.*, 
        driver_accounts.phone_num AS driver_phone
      FROM 
        reservations 
      INNER JOIN 
        rides ON reservations.ride_id = rides.id 
      INNER JOIN 
        driver_accounts ON rides.driver_id = driver_accounts.id
      WHERE 
        reservations.passenger_id = ? ${statusFilter}
    `;
    const [reservations] = await dbCon.query(getReservationsQuery, [
      passengerId,
    ]);

    return res.status(200).json(reservations);
  } catch (error) {
    console.error("Error when fetching passenger reservations:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function confirmDriverAtPickup(req, res) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userType = decoded.userType;
    const driverId = decoded.userId;

    const reservationId = req.query.reservationId;
    const driverLatitude = req.body.latitude;
    const driverLongitude = req.body.longitude;

    if (userType !== "driver") {
      return res
        .status(403)
        .json({ error: "Only drivers can confirm arrival at pick-up" });
    }

    const isValidLocation = isValidCoordinates(driverLatitude, driverLongitude);
    if (!isValidLocation) {
      return res.status(403).json({
        error:
          "You must provide valid location to confirm that you are at pick-up",
      });
    }
    // Check if the driver is associated with the reservation
    const isAssociated = await isDriverAssociatedWithReservation(
      driverId,
      reservationId
    );
    if (!isAssociated) {
      return res
        .status(403)
        .json({ error: "This reservation is not associated with the driver" });
    }

    // Update driver location and status in the reservations table
    await updateDriverLocationAndStatus(
      driverLatitude,
      driverLongitude,
      reservationId
    );

    return res
      .status(200)
      .json({ message: "Driver succesfuly confirmed that the is at pick-up" });
  } catch (error) {
    console.error("Error when updating driver location and status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  instantReserve,
  confirmArrival,
  getMyReservations,
  confirmDriverAtPickup,
};
