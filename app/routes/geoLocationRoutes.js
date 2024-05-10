const express = require("express");
const locationsController = require("../controllers/geoLocationController");

const router = express.Router();

// Route to get autocomplete suggestions based on input
router.get("/autocomplete", locationsController.locationsLookup);

router.get("/get-location", locationsController.getLocationApi);

module.exports = router;
