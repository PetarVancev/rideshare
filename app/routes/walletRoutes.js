const express = require("express");
const multer = require("multer");

const withdrawalController = require("../controllers/withdrawalController");
const depositController = require("../controllers/depositController");
const transactionsController = require("../controllers/transactionsController");
const walletController = require("../controllers/walletController");

const router = express.Router();
const upload = multer();

router.get("/get-wallet", walletController.getWallet);

router.post("/change-bank-acc", walletController.changeBankAcc);

router.get("/change-bank-acc", walletController.changeBankAcc);

router.post("/withdraw", withdrawalController.requestWithdraw);

router.get("/get-withdrawals", withdrawalController.getWithdrawals);

router.post("/start-deposit", depositController.startDeposit);

router.post("/deposit", upload.none(), depositController.deposit);

router.post("/payment-failed", (req, res) => {
  return res.redirect(303, `${process.env.CLIENT_URL}/wallet/deposit-failed`);
});

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
