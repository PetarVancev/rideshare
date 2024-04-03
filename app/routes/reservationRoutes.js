const express = require("express");
const reservationsController = require("../controllers/reservationsController");

const router = express.Router();

router.get("/passenger/get-my", reservationsController.getMyReservations);

router.post("/passenger/reserve", reservationsController.handleReservation);

router.post(
  "/passenger/confirm-arrival",
  reservationsController.confirmArrival
);

router.post(
  "/driver/confirm-pickup",
  reservationsController.confirmDriverAtPickup
);

router.post(
  "/driver/accept-proposal",
  reservationsController.acceptReservationProposal
);

router.post(
  "/driver/decline-proposal",
  reservationsController.declineReservationProposal
);

module.exports = router;
