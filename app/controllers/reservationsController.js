const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dbCon = require("../db");

const emailTemplates = require("../emailTemplates");

const ridesController = require("./ridesController");
const transactionsController = require("./transactionsController");
const locationsController = require("./geoLocationController");
const reviewsController = require("./reviewsController");
const accountsController = require("./accountsController");

const isDriverAssociatedWithRide = ridesController.isDriverAssociatedWithRide;

const transporter = nodemailer.createTransport({
  name: "mail.rideshare.mk",
  host: "mail.rideshare.mk",
  port: 465,
  secure: true,
  auth: {
    user: "donotreply@rideshare.mk",
    pass: process.env.EMAIL_PASSWORD,
  },
});

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

async function updateReservationStatus(connection, reservationId, status) {
  const updateReservationQuery =
    "UPDATE reservations SET status = ? WHERE id = ?";
  await connection.query(updateReservationQuery, [status, reservationId]);
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

async function addToBalance(connection, passengerId, refundAmount) {
  const updateBalanceQuery = `
    UPDATE passenger_accounts
    SET balance = balance + ?
    WHERE id = ?
  `;

  await connection.query(updateBalanceQuery, [refundAmount, passengerId]);
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
  pickUpLocationLat,
  pickUpLocationLon,
  dropOffLocationLat,
  dropOffLocationLon,
  status,
  custom_pick_up,
  custom_drop_off
) {
  const insertReservationQuery =
    "INSERT INTO reservations (ride_id, passenger_id, num_seats, status, pick_up_lat, pick_up_lon, drop_off_lat, drop_off_lon, custom_pick_up, custom_drop_off) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  await connection.query(insertReservationQuery, [
    rideId,
    passengerId,
    seatsNeeded,
    status,
    pickUpLocationLat,
    pickUpLocationLon,
    dropOffLocationLat,
    dropOffLocationLon,
    custom_pick_up,
    custom_drop_off,
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

const confirmDriverAtPickupForRide = async (
  driverLatitude,
  driverLongitude,
  rideId
) => {
  const updateQuery = `
      UPDATE rides
      SET driver_lat = ?,
          driver_lon = ?,
          driver_arrived = 1
      WHERE id = ?
    `;

  await dbCon.query(updateQuery, [driverLatitude, driverLongitude, rideId]);
};

function isValidCoordinates(lat, lon) {
  if (!lat || !lon) {
    return false;
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

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

async function deleteReservationProposal(connection, reservation) {
  const { id, passenger_id, num_seats, ride_price } = reservation;
  const refundAmount = num_seats * ride_price;

  const statusQuery = `
    SELECT status
    FROM reservations
    WHERE id = ?
  `;
  const [statusRows] = await connection.query(statusQuery, [id]);
  if (statusRows.length === 0) {
    // throw new Error("Reservation not found");
    throw new Error("Резервацијата не постои");
  }
  const { status } = statusRows[0];

  // Check if status is 'P'
  if (status !== "P") {
    // throw new Error("The reservation is not a proposal");
    throw new Error("Резервацијата не е предлог");
  }

  // Refund to passenger
  await addToBalance(connection, passenger_id, refundAmount);

  // Delete reservation
  const deleteQuery = `
    DELETE FROM reservations
    WHERE id = ?
  `;
  await connection.query(deleteQuery, [id]);

  const ride = await ridesController.getRide(dbCon, reservation.ride_id);

  const passengerEmail = await accountsController.getUserEmail(
    reservation.passenger_id,
    "passenger"
  );

  const mailOptions = {
    from: "donotreply@rideshare.mk",
    to: passengerEmail,
    subject: "Одбиен предлог за патување",
    html: emailTemplates.proposalDeclinedEmail(ride),
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred:", error.message);
    }
  });
}

async function removeExcessReservations(
  connection,
  rideId,
  availableSeats,
  ridePrice
) {
  const excessReservationsQuery = `
    SELECT id, passenger_id, num_seats
    FROM reservations
    WHERE ride_id = ? AND num_seats > ?
  `;

  const [excessReservations] = await connection.query(excessReservationsQuery, [
    rideId,
    availableSeats,
  ]);
  for (const reservation of excessReservations) {
    await deleteReservationProposal(connection, {
      ...reservation,
      ridePrice: ridePrice,
    });
  }
}

async function getProposal(proposalId) {
  const query = `
  SELECT p.*, r.driver_id, r.price AS ride_price
  FROM reservations p
  JOIN rides r ON p.ride_id = r.id
  WHERE p.id = ?
  `;

  const [proposalRows] = await dbCon.query(query, [proposalId]);

  // If proposal exists, return the first row
  if (proposalRows.length > 0) {
    return proposalRows[0];
  }

  // If proposal does not exist, return null
  return null;
}

async function handleReservation(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    // return res.status(401).json({ error: "Unauthorized: Token missing" });
    return res
      .status(401)
      .json({ error: "Неавторизирано: Недостига токен за најава" });
  }

  let connection;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userType = decoded.userType;
    const passengerId = decoded.userId;

    const rideId = req.query.rideId;
    const seatsNeeded = parseInt(req.query.seats);

    let customPickUp = req.body.custom_pick_up;
    let customDropOff = req.body.custom_drop_off;

    if (seatsNeeded < 1) {
      // return res
      //   .status(403)
      //   .json({ error: "You can't reserve less than 1 seat" });
      return res.status(403).json({ error: "Резервирајте минимум 1 место" });
    }

    if (userType !== "passenger") {
      return res
        .status(403)
        .json({ error: "Only passengers can reserve seats" });
    }

    connection = await dbCon.getConnection();
    await connection.beginTransaction();

    const ride = await ridesController.getRide(connection, rideId);

    if (!ride) {
      await connection.rollback();
      return res.status(404).json({ error: "Ride not found" });
    }

    if (ride.free_seats < seatsNeeded) {
      await connection.rollback();
      return res.status(403).json({
        error: "Возењето нема доволно места, освежете ја страната",
        freeSeats: ride.free_seats,
      });
    }

    let pickUpLocation, dropOffLocation;

    if (!customPickUp && !customDropOff) {
      pickUpLocation = await getLocationInfo(connection, ride.from_loc_id);
      dropOffLocation = await getLocationInfo(connection, ride.to_loc_id);
    } else {
      if (customPickUp) {
        if (!ride.flexible_departure) {
          await connection.rollback();
          return res
            .status(400)
            .json({ error: "Flexible pick up not allowed for ride" });
        }
        if (
          !isValidCoordinates(
            customPickUp.location_lat,
            customPickUp.location_lon
          )
        ) {
          await connection.rollback();
          return res
            .status(400)
            .json({ error: "Pick up coordinates are not valid" });
        }
        pickUpLocation = customPickUp;
      } else {
        pickUpLocation = await getLocationInfo(connection, ride.from_loc_id);
      }

      if (customDropOff) {
        if (!ride.flexible_arrival) {
          await connection.rollback();
          return res
            .status(400)
            .json({ error: "Flexible drop off not allowed for ride" });
        }
        if (
          !isValidCoordinates(
            customDropOff.location_lat,
            customDropOff.location_lon
          )
        ) {
          await connection.rollback();
          return res
            .status(400)
            .json({ error: "Drop off coordinates are not valid" });
        }
        dropOffLocation = customDropOff;
      } else {
        dropOffLocation = await getLocationInfo(connection, ride.to_loc_id);
      }
    }

    const passenger = await getPassengerBalance(connection, passengerId);

    if (!passenger) {
      await connection.rollback();
      return res.status(404).json({ error: "Passenger not found" });
    }

    const currentBalance = passenger.balance;
    const newBalance = currentBalance - ride.price * seatsNeeded;

    if (newBalance < 0) {
      await connection.rollback();
      // return res.status(402).json({
      //   error: `Insufficient balance, you need ${-newBalance} more funds`,
      // });
      return res.status(402).json({
        error: `Немате доволно средства, ви требаат уште ${-newBalance}ден`,
      });
    }

    await updateBalance(connection, passengerId, newBalance);
    await updateFreeSeats(connection, rideId, ride.free_seats - seatsNeeded);

    const reservationType = customPickUp || customDropOff ? "P" : "R";

    if (reservationType == "R") {
      await removeExcessReservations(
        connection,
        ride.id,
        seatsNeeded,
        ride.price
      );
    }

    await insertReservation(
      connection,
      rideId,
      passengerId,
      seatsNeeded,
      pickUpLocation.location_lat,
      pickUpLocation.location_lon,
      dropOffLocation.location_lat,
      dropOffLocation.location_lon,
      reservationType,
      !!customPickUp,
      !!customDropOff
    );

    await connection.commit();

    const driverEmail = await accountsController.getUserEmail(
      ride.driver_id,
      "driver"
    );

    if (reservationType === "P") {
      const mailOptions = {
        from: "donotreply@rideshare.mk",
        to: driverEmail,
        subject: "Нов предлог за патување",
        html: emailTemplates.proposalRecievedEmail(ride),
      };

      await transporter.sendMail(mailOptions);
    }

    const message =
      reservationType === "R"
        ? "Reservation successful"
        : "Reservation proposed successfully";

    return res.status(201).json({ message });
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

    await updateReservationStatus(connection, reservationId, "C");

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
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userType = decoded.userType;
    const passengerId = decoded.userId;

    if (userType !== "passenger") {
      return res
        .status(403)
        .json({ error: "Only passengers can view reservations" });
    }

    let status = req.query.status || "";
    let statusFilter = "";

    if (status) {
      statusFilter = ` AND reservations.status = '${status}'`;
    }

    const getReservationsQuery = `
      SELECT
        reservations.id as reservation_id,
        reservations.status,
        reservations.num_seats,
        rides.*, 
        driver_accounts.name AS driver_name,
        CASE
          WHEN reservations.status = 'R' THEN driver_accounts.phone_num
          ELSE NULL
        END AS phone_num
      FROM 
        reservations 
      INNER JOIN 
        rides ON reservations.ride_id = rides.id 
      INNER JOIN 
        driver_accounts ON rides.driver_id = driver_accounts.id
      WHERE 
        reservations.passenger_id = ? ${statusFilter}
      ORDER BY
       rides.date_time ASC
    `;
    const [reservations] = await dbCon.query(getReservationsQuery, [
      passengerId,
    ]);

    // Separate reservations, rides, and drivers into individual objects
    const formattedReservations = await Promise.all(
      reservations.map(async (reservation) => {
        const [fromLocation] = await locationsController.getLocation(
          reservation.from_loc_id
        );
        const [toLocation] = await locationsController.getLocation(
          reservation.to_loc_id
        );
        const reviewsAverage = await reviewsController.getDriverReviewsAverage(
          reservation.driver_id
        );

        return {
          reservation: {
            id: reservation.reservation_id,
            status: reservation.status,
            num_seats: reservation.num_seats,
            price: reservation.num_seats * reservation.price,
            // Add other reservation properties as needed
          },
          ride: {
            id: reservation.id,
            from_loc_id: reservation.from_loc_id,
            from_location_name: fromLocation.name,
            to_loc_id: reservation.to_loc_id,
            to_location_name: toLocation.name,
            date_time: reservation.date_time,
            ride_duration: reservation.ride_duration,
            // Add other ride properties as needed
          },
          driver: {
            id: reservation.driver_id,
            name: reservation.driver_name,
            phone_num:
              reservation.status === "R" ? reservation.phone_num : null,
            reviews_average: reviewsAverage,
            // Add other driver properties as needed
          },
        };
      })
    );

    return res.status(200).json(formattedReservations);
  } catch (error) {
    console.error("Error when fetching passenger reservations:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function declineReservationProposal(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    // return res.status(401).json({ error: "Unauthorized: Token missing" });
    return res
      .status(401)
      .json({ error: "Неавторизирано: Недостига токен за најава" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userType = decoded.userType;
    const driverId = decoded.userId;

    if (userType !== "driver") {
      return res
        .status(403)
        .json({ error: "Only drivers can decline reservations" });
    }

    const proposalId = req.query.reservationId;

    const proposal = await getProposal(proposalId);

    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    if (proposal.driver_id !== driverId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to decline this proposal" });
    }

    await deleteReservationProposal(dbCon, proposal);

    return res
      .status(200)
      .json({ message: "Reservation proposal declined successfully" });
  } catch (error) {
    console.error("Error when declining reservation proposal:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function acceptReservationProposal(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    // return res.status(401).json({ error: "Unauthorized: Token missing" });
    return res
      .status(401)
      .json({ error: "Неавторизирано: Недостига токен за најава" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userType = decoded.userType;
    const driverId = decoded.userId;

    if (userType !== "driver") {
      return res
        .status(403)
        .json({ error: "Only drivers can accept reservations" });
    }

    const proposalId = req.query.reservationId;

    const proposal = await getProposal(proposalId);

    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    if (proposal.driver_id !== driverId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to accept this proposal" });
    }

    await updateReservationStatus(dbCon, proposalId, "R");

    await removeExcessReservations(
      dbCon,
      proposal.ride_id,
      proposal.num_seats,
      proposal.ride_price
    );

    const ride = await ridesController.getRide(dbCon, proposal.ride_id);

    const passengerEmail = await accountsController.getUserEmail(
      proposal.passenger_id,
      "passenger"
    );

    const mailOptions = {
      from: "donotreply@rideshare.mk",
      to: passengerEmail,
      subject: "Прифатен предлог за патување",
      html: emailTemplates.proposalАcceptedEmail(ride),
    };

    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "Reservation proposal accepted successfully" });
  } catch (error) {
    console.error("Error when accepting reservation proposal:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function confirmDriverAtPickup(req, res) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      // return res.status(401).json({ error: "Unauthorized: Token missing" });
      return res
        .status(401)
        .json({ error: "Неавторизирано: Недостига токен за најава" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userType = decoded.userType;
    const driverId = decoded.userId;

    const reservationId = req.query.reservationId;
    const rideId = req.query.rideId;
    const driverLatitude = req.body.latitude;
    const driverLongitude = req.body.longitude;

    if (reservationId && rideId) {
      return res.status(400).json({ error: "Provide reservationId or rideId" });
    }

    if (userType !== "driver") {
      return res
        .status(403)
        .json({ error: "Only drivers can confirm arrival at pick-up" });
    }

    const isValidLocation = isValidCoordinates(driverLatitude, driverLongitude);
    if (!isValidLocation) {
      // return res.status(403).json({
      //   error:
      //     "You must provide valid location to confirm that you are at pick-up",
      // });
      return res.status(403).json({
        error:
          "Вашата локација не е валидна, дозволете пристап до вашата локација",
      });
    }

    if (reservationId) {
      const isAssociated = await isDriverAssociatedWithReservation(
        driverId,
        reservationId
      );
      if (!isAssociated) {
        return res.status(403).json({
          error: "This reservation is not associated with the driver",
        });
      }

      await updateDriverLocationAndStatus(
        driverLatitude,
        driverLongitude,
        reservationId
      );

      return res.status(200).json({
        message: "Driver successfully confirmed that they are at pick-up",
      });
    } else if (rideId) {
      const isAssociated = await isDriverAssociatedWithRide(driverId, rideId);
      if (!isAssociated) {
        return res.status(403).json({
          error: "This ride is not associated with the driver",
        });
      }

      await confirmDriverAtPickupForRide(
        driverLatitude,
        driverLongitude,
        rideId
      );

      return res.status(200).json({
        message: "Driver successfully confirmed arrival at pick-up for ride",
      });
    } else {
      return res
        .status(400)
        .json({ error: "Provide either reservationId or rideId" });
    }
  } catch (error) {
    console.error("Error when updating driver location and status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteProposedReservation(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    // return res.status(401).json({ error: "Unauthorized: Token missing" });
    return res
      .status(401)
      .json({ error: "Неавторизирано: Недостига токен за најава" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userType = decoded.userType;
    const passengerId = decoded.userId;

    if (userType != "passenger") {
      return res
        .status(403)
        .json({ error: "This endpoint is only for passengers" });
    }

    const { proposalId } = req.query;

    if (!proposalId) {
      return res.status(404).json({ error: "You must provide proposal id" });
    }

    if (!(await checkReservationOwnership(dbCon, proposalId, passengerId))) {
      return res
        .status(403)
        .json({ error: "You can only cancel your proposals" });
    }

    const proposal = await getProposal(proposalId);

    await deleteReservationProposal(dbCon, proposal);

    return res.status(200).json({ message: "Successfuly deleted proposal" });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or expired token" });
    } else {
      console.error("Error when removing proposal", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = {
  handleReservation,
  acceptReservationProposal,
  declineReservationProposal,
  deleteProposedReservation,
  confirmArrival,
  getMyReservations,
  confirmDriverAtPickup,
};
