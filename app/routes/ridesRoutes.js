const express = require("express");
const ridesController = require("../controllers/ridesController");

const router = express.Router();

router.post("/create", ridesController.postRide);

router.get("/get-my", ridesController.getMyRides);

router.get("/search", ridesController.searchForRides);

router.get("/get-ride", ridesController.getRideInfo);

router.delete("/delete/:rideId", ridesController.deleteRide);

module.exports = router;
