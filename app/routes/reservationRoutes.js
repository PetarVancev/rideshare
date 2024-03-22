const express = require("express");
const reservationsController = require("../controllers/reservationsController");

const router = express.Router();

router.get("/get-my", reservationsController.getMyReservations);

router.post("/instant-reserve", reservationsController.instantReserve);

router.post("/confirm-arrival", reservationsController.confirmArrival);

module.exports = router;
