const express = require("express");
const locationsLookup = require("../controllers/geoLocationController");

const router = express.Router();

// Route to get autocomplete suggestions based on input
router.get("/autocomplete/:name", locationsLookup);

module.exports = router;
