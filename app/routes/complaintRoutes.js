const express = require("express");
const complaintsController = require("../controllers/complaintsController");

const router = express.Router();

// TO do, write a function for complaints resolution

// router.get("/get-all", complaintsController.getAllComplaints);

router.post("/send-complaint", complaintsController.sendComplaint);

module.exports = router;
