const jwt = require("jsonwebtoken");
const dbCon = require("../db");

async function instantReserve(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  let connection; // Declare the connection variable

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

    if (userType != "passenger") {
      return res
        .status(403)
        .json({ error: "Only passengers can reserve seats" });
    }

    // Acquire a connection from the pool
    connection = await dbCon.getConnection();

    // Start a database transaction
    await connection.beginTransaction();

    const checkFreeSeatsQuery =
      "SELECT free_seats, from_loc_id, price FROM rides WHERE id = ? FOR UPDATE";
    const [rideRows] = await connection.query(checkFreeSeatsQuery, [rideId]);
    const ride = rideRows[0];

    if (ride.length == 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Ride not found" });
    } else if (ride.free_seats < seatsNeeded) {
      console.log("err");
      await connection.rollback();
      return res
        .status(403)
        .json({ error: "Not enough seats", freeSeats: ride.free_seats });
    }

    const checkBalanceQuery =
      "SELECT balance FROM passenger_accounts WHERE id = ? FOR UPDATE";
    const [passengerRows] = await connection.query(checkBalanceQuery, [
      passengerId,
    ]);
    const passenger = passengerRows[0];

    const currentBalance = passenger.balance;
    const newBalance = currentBalance - ride.price * seatsNeeded;
    if (newBalance < 0) {
      return res.status(402).json({
        message:
          "Insufficient balance, you need " + -newBalance + " more funds",
      });
    } else {
      const updateBalanceQuery =
        "UPDATE passenger_accounts SET balance = ? WHERE id = ?";
      await connection.query(updateBalanceQuery, [newBalance, passengerId]);
    }

    const currentFreeSeats = ride.free_seats;
    const newFreeSeats = currentFreeSeats - seatsNeeded;

    const updateBalanceQuery = "UPDATE rides SET free_seats = ? WHERE id = ?";
    await connection.query(updateBalanceQuery, [newFreeSeats, rideId]);

    const selectPickUpLocationQuery =
      "SELECT location_lat, location_lon FROM locations WHERE id = ? FOR UPDATE";
    const [locationRows] = await connection.query(selectPickUpLocationQuery, [
      ride.from_loc_id,
    ]);
    const location = locationRows[0];

    const insertReservationQuery =
      "INSERT INTO reservations (ride_id, passenger_id, num_seats, status, pick_up_lat, pick_up_lon) VALUES (?, ?, ?, CONVERT(? USING utf8mb4), ?, ?)";
    await connection.query(insertReservationQuery, [
      rideId,
      passengerId,
      seatsNeeded,
      "R",
      location.location_lat,
      location.location_lon,
    ]);

    // Commit the transaction
    await connection.commit();

    return res.status(201).json({
      message: "Reservation succesfull",
    });
  } catch (error) {
    // Rollback the transaction if an error occurs
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
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
}

module.exports = { instantReserve };

//              FUNCTIONS VERSION
// async function instantReserve(req, res) {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized: Token missing" });
//   }

//   let connection; // Declare the connection variable

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const { userType, userId } = getDecodedUserInfo(decoded);
//     const { rideId, seatsNeeded } = getReservationInfo(req);

//     if (!isValidSeatCount(seatsNeeded)) {
//       return res.status(403).json({ error: "You can't reserve less than 1 seat" });
//     }

//     if (!isPassenger(userType)) {
//       return res.status(403).json({ error: "Only passengers can reserve seats" });
//     }

//     connection = await dbCon.getConnection();
//     await connection.beginTransaction();

//     const ride = await getRideInfo(connection, rideId);

//     if (!ride) {
//       await connection.rollback();
//       return res.status(404).json({ error: "Ride not found" });
//     }

//     if (!hasEnoughSeats(ride.free_seats, seatsNeeded)) {
//       await connection.rollback();
//       return res.status(403).json({ error: "Not enough seats", freeSeats: ride.free_seats });
//     }

//     const passenger = await getPassengerInfo(connection, userId);
//     const newBalance = updatePassengerBalance(passenger.balance, ride.price, seatsNeeded);

//     if (newBalance < 0) {
//       return res.status(402).json({ message: `Insufficient balance, you need ${-newBalance} more funds` });
//     }

//     await updatePassengerBalanceInDB(connection, userId, newBalance);
//     await updateRideSeatsInDB(connection, rideId, ride.free_seats - seatsNeeded);

//     const location = await getPickUpLocationInfo(connection, ride.from_loc_id);
//     await insertReservation(connection, rideId, userId, seatsNeeded, location.location_lat, location.location_lon);

//     await connection.commit();

//     return res.status(201).json({ message: "Reservation successful" });
//   } catch (error) {
//     handleErrors(res, connection, error);
//   } finally {
//     if (connection) {
//       connection.release();
//     }
//   }
// }

// function getDecodedUserInfo(decoded) {
//   const { userType, userId } = decoded;
//   return { userType, userId };
// }

// function getReservationInfo(req) {
//   const rideId = req.query.rideId;
//   const seatsNeeded = req.query.seats;
//   return { rideId, seatsNeeded };
// }

// function isValidSeatCount(seatsNeeded) {
//   return seatsNeeded >= 1;
// }

// function isPassenger(userType) {
//   return userType === "passenger";
// }

// async function getRideInfo(connection, rideId) {
//   const [rideRows] = await connection.query("SELECT free_seats, from_loc_id, price FROM rides WHERE id = ? FOR UPDATE", [rideId]);
//   return rideRows[0];
// }

// function hasEnoughSeats(freeSeats, seatsNeeded) {
//   return freeSeats >= seatsNeeded;
// }

// async function getPassengerInfo(connection, userId) {
//   const [passengerRows] = await connection.query("SELECT balance FROM passenger_accounts WHERE id = ? FOR UPDATE", [userId]);
//   return passengerRows[0];
// }

// function updatePassengerBalance(currentBalance, ridePrice, seatsNeeded) {
//   return currentBalance - ridePrice * seatsNeeded;
// }

// async function updatePassengerBalanceInDB(connection, userId, newBalance) {
//   await connection.query("UPDATE passenger_accounts SET balance = ? WHERE id = ?", [newBalance, userId]);
// }

// async function updateRideSeatsInDB(connection, rideId, newFreeSeats) {
//   await connection.query("UPDATE rides SET free_seats = ? WHERE id = ?", [newFreeSeats, rideId]);
// }

// async function getPickUpLocationInfo(connection, locationId) {
//   const [locationRows] = await connection.query("SELECT location_lat, location_lon FROM locations WHERE id = ? FOR UPDATE", [locationId]);
//   return locationRows[0];
// }

// async function insertReservation(connection, rideId, passengerId, seatsNeeded, locationLat, locationLon) {
//   await connection.query("INSERT INTO reservations (ride_id, passenger_id, num_seats, status, pick_up_lat, pick_up_lon) VALUES (?, ?, ?, 'R', ?, ?)", [rideId, passengerId, seatsNeeded, locationLat, locationLon]);
// }

// function handleErrors(res, connection, error) {
//   if (connection) {
//     connection.rollback();
//   }

//   if (error.name === "JsonWebTokenError") {
//     res.status(401).json({ error: "Unauthorized: Invalid token" });
//   } else {
//     console.error("Error when reserving ride:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }

// module.exports = { instantReserve };
