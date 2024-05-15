const express = require("express");
const supportController = require("../controllers/supportController");

const router = express.Router();

router.post("/send-contact-form", supportController.sendContactForm);

module.exports = router;
