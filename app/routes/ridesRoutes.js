const express = require("express");
const ridesController = require("../controllers/ridesController");

const router = express.Router();

router.post("/create", ridesController.postRide);

router.get("/get-my", ridesController.getMyRides);

router.get("/search", ridesController.searchForRides);

router.delete("/delete/:rideId", ridesController.deleteRide);

module.exports = router;
