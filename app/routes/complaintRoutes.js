const express = require("express");
const complaintsController = require("../controllers/complaintsController");

const router = express.Router();

router.get("/get-all", complaintsController.getAllComplaints);

router.post("/send-complaint", complaintsController.sendComplaint);

module.exports = router;
