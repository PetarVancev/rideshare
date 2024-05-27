const jwt = require("jsonwebtoken");
const dbCon = require("../db");

const paymentController = require("./paymentController.js");

async function startDeposit(req, res) {
  // Set denomination amount here
  const denomination = 300;

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const amount = req.body.amount;

    if (amount % denomination != 0) {
      return res.status(403).json({
        error: "You can only deposit in denominations of " + denomination,
      });
    }

    const userType = decoded.userType;
    const passengerId = decoded.userId;

    if (userType != "passenger") {
      return res.status(403).json({ error: "Only passengers can deposit" });
    }

    // Append user id to callback url as query
    req.body.okurl = `${process.env.BACKEND_URL}/wallet/deposit?userId=${passengerId}`;
    req.body.failUrl = `${process.env.BACKEND_URL}/wallet/payment-failed`;
    req.body.callbackUrl = "";
    const response = await paymentController.processPayment(req.body);
    return res.status(200).json(response);
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or expired token" });
    } else {
      console.error("Error when starting deposit", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

async function deposit(req, res) {
  let connection; // Declare the connection variable

  if (!paymentController.isValidPayment(req.body)) {
    console.log("Payment hash invalid");
    return res.redirect(
      303,
      `${process.env.CLIENT_URL}/wallet/deposit-failed?error=401`
    );
  }

  if (req.body.Response != "Approved") {
    console.log("Payment not approved");
    return res.redirect(
      303,
      `${process.env.CLIENT_URL}/wallet/deposit-failed?error=402`
    );
  }
  try {
    const amount = req.body.amount;
    const passengerId = req.query.userId;

    // Acquire a connection from the pool
    connection = await dbCon.getConnection();

    // Start a database transaction
    await connection.beginTransaction();

    const selectBalanceQuery =
      "SELECT balance FROM passenger_accounts WHERE id = ? FOR UPDATE";
    const [balanceRows] = await connection.query(selectBalanceQuery, [
      passengerId,
    ]);

    if (balanceRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "User not found" });
    }

    const currentBalance = balanceRows[0].balance;
    const newBalance = parseInt(currentBalance) + parseInt(amount);

    const updateBalanceQuery =
      "UPDATE passenger_accounts SET balance = ? WHERE id = ?";
    await connection.query(updateBalanceQuery, [newBalance, passengerId]);

    const withdrawalDateTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const insertDepositQuery =
      "INSERT INTO deposits (passenger_id, amount, date_time) VALUES (?, ?, ?)";
    await connection.query(insertDepositQuery, [
      passengerId,
      amount,
      withdrawalDateTime,
    ]);

    // Commit the transaction
    await connection.commit();

    return res.redirect(
      303,
      `${process.env.CLIENT_URL}/wallet/deposit-success`
    );
  } catch (error) {
    // Rollback the transaction if an error occurs
    if (connection) {
      await connection.rollback();
    } else {
      console.error("Error when depositing:", error);
      return res.redirect(
        303,
        `${process.env.CLIENT_URL}/wallet/deposit-failed?error=500`
      );
    }
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
}

async function getDeposits(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userType = decoded.userType;
    const userId = decoded.userId;

    if (userType != "passenger") {
      return res.status(403).json({ error: "Only passengers have deposits" });
    }

    const query =
      "SELECT * FROM deposits WHERE passenger_id = ? ORDER BY date_time DESC";
    const [deposits] = await dbCon.query(query, [userId]);

    if (deposits.length === 0) {
      return res.status(404).json({ error: "No withdrawals found" });
    }

    return res.status(200).json(deposits);
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or expired token" });
    } else {
      console.error("Error when withdrawing:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = { deposit, startDeposit, getDeposits };
