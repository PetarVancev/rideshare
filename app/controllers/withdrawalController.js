const jwt = require("jsonwebtoken");
const dbCon = require("../db");
const { get } = require("../routes/walletRoutes");

async function confirmWithdrawal(withdrawalId) {
  try {
    const sql = `UPDATE withdrawals SET status = 'C' WHERE id = ?`;
    const [result] = await dbCon.query(sql, [withdrawalId]);

    if (result.affectedRows === 0) {
      throw new Error("Withdrawal not found");
    }

    return { message: "Withdrawal confirmed successfully" };
  } catch (error) {
    console.error("Error confirming withdrawal:", error);
    throw error;
  }
}

async function requestWithdraw(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  let connection; // Declare the connection variable

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const amount = req.body.amount;

    const userType = decoded.userType;
    const driverId = decoded.userId;

    if (userType != "driver") {
      return res.status(403).json({ error: "Only drivers can withdraw" });
    }

    // Acquire a connection from the pool
    connection = await dbCon.getConnection();

    // Start a database transaction
    await connection.beginTransaction();

    const selectBalanceQuery =
      "SELECT balance FROM driver_accounts WHERE id = ? FOR UPDATE";
    const [balanceRows] = await connection.query(selectBalanceQuery, [
      driverId,
    ]);

    if (balanceRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "User not found" });
    }

    const currentBalance = balanceRows[0].balance;

    if (currentBalance < amount) {
      await connection.rollback();
      return res.status(402).json({ message: "Insufficient balance" });
    }

    const newBalance = currentBalance - amount;

    const updateBalanceQuery =
      "UPDATE driver_accounts SET balance = ? WHERE id = ?";
    await connection.query(updateBalanceQuery, [newBalance, driverId]);

    const withdrawalDateTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const insertWithdrawalQuery =
      "INSERT INTO withdrawals (driver_id, amount, date_time) VALUES (?, ?, ?)";
    await connection.query(insertWithdrawalQuery, [
      driverId,
      amount,
      withdrawalDateTime,
    ]);

    // Commit the transaction
    await connection.commit();

    return res.status(201).json({
      message: "Withdraw requested successfully",
      newBalance: newBalance,
    });
  } catch (error) {
    // Rollback the transaction if an error occurs
    if (connection) {
      await connection.rollback();
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    } else {
      console.error("Error when withdrawing:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
}

async function getWithdrawals(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  let connection; // Declare the connection variable

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userType = decoded.userType;
    const driverId = decoded.userId;

    if (userType != "driver") {
      return res.status(403).json({ error: "Only drivers can withdraw" });
    }

    const query = "SELECT * FROM withdrawals WHERE driver_id = ?";
    const [withdrawals] = await dbCon.query(query, [driverId]);

    if (withdrawals.length === 0) {
      return res.status(404).json({ error: "No withdrawals found" });
    }

    return res.status(200).json(withdrawals);
  } catch (error) {
    // Rollback the transaction if an error occurs
    if (connection) {
      await connection.rollback();
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    } else {
      console.error("Error when withdrawing:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = { requestWithdraw, confirmWithdrawal, getWithdrawals };
