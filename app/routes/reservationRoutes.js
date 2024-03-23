const express = require("express");
const reservationsController = require("../controllers/reservationsController");

const router = express.Router();

router.get("/passenger/get-my", reservationsController.getMyReservations);

router.post(
  "/passenger/instant-reserve",
  reservationsController.instantReserve
);

router.post(
  "/passenger/confirm-arrival",
  reservationsController.confirmArrival
);

router.post(
  "/driver/confirm-pickup",
  reservationsController.confirmDriverAtPickup
);

module.exports = router;
