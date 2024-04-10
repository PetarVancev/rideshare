const express = require("express");

const withdrawalController = require("../controllers/withdrawalController");
const depositController = require("../controllers/depositController");
const transactionsController = require("../controllers/transactionsController");

const router = express.Router();

router.post("/withdraw", withdrawalController.requestWithdraw);

router.get("/get-withdrawals", withdrawalController.getWithdrawals);

router.post("/deposit", depositController.deposit);

router.get(
  "/get-ride-transactions",
  transactionsController.getTransactionsForRide
);

module.exports = router;
