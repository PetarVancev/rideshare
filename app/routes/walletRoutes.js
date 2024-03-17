const express = require("express");

const withdrawalController = require("../controllers/withdrawalController");
const depositController = require("../controllers/depositController");

const router = express.Router();

router.post("/withdraw", withdrawalController.requestWithdraw);

router.post("/deposit", depositController.deposit);

module.exports = router;
