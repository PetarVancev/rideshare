const express = require("express");
const reservationsController = require("../controllers/reservationsController");

const router = express.Router();

router.post("/instant-reserve", reservationsController.instantReserve);

router.post("/confirm-arrival", reservationsController.confirmArrival);

module.exports = router;
