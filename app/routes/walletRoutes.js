const express = require("express");

const withdrawalController = require("../controllers/withdrawalController");
const depositController = require("../controllers/depositController");
const transactionsController = require("../controllers/transactionsController");
const walletController = require("../controllers/walletController");

const router = express.Router();

router.get("/get-wallet", walletController.getWallet);

router.post("/change-bank-acc", walletController.changeBankAcc);

router.get("/change-bank-acc", walletController.changeBankAcc);

router.post("/withdraw", withdrawalController.requestWithdraw);

router.get("/get-withdrawals", withdrawalController.getWithdrawals);

router.post("/deposit", depositController.deposit);

router.get("/get-deposits", depositController.getDeposits);

router.get(
  "/get-ride-transactions",
  transactionsController.getTransactionsForRide
);

router.get(
  "/get-passenger-transactions",
  transactionsController.getPassengerTransactions
);

module.exports = router;
