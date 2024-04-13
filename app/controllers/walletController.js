const jwt = require("jsonwebtoken");
const dbCon = require("../db");

async function getWallet(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userType = decoded.userType;
    const driverId = decoded.userId;

    let query;
    if (userType === "passenger") {
      query = "SELECT balance FROM passenger_accounts WHERE id = ?";
    } else {
      query = `SELECT balance,bank_acc_num FROM driver_accounts WHERE id = ?`;
    }

    const [balance] = await dbCon.query(query, [driverId]);

    if (balance.length === 0) {
      return res.status(404).json({ error: "User doesnt exist" });
    }
    console.log(balance);
    return res.status(200).json(balance);
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    } else {
      console.error("Error when withdrawing:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

async function changeBankAcc(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userType = decoded.userType;
    const driverId = decoded.userId;

    const newBankAcc = req.body.bankAcc;

    if (userType === "passenger") {
      return res
        .status(403)
        .json({ error: "Only drivers can access this endpoint" });
    }

    if (!newBankAcc) {
      return res.status(400).json({ error: "Bank account number is required" });
    }

    const query = "UPDATE driver_accounts SET bank_acc_num = ? WHERE id = ?";
    const [result] = await dbCon.query(query, [newBankAcc, driverId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "Bank account successfuly updated",
      newBankAcc: newBankAcc,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    } else {
      console.error("Error when withdrawing:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = { getWallet, changeBankAcc };
