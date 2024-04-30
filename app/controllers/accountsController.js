const jwt = require("jsonwebtoken");
const dbCon = require("../db");

const registerController = require("./registerController");
const userTypeToDbTableName =
  require("./registerController").userTypeToDbTableName;

async function getUserEmail(userId, userType) {
  const dbName = userTypeToDbTableName(userType);
  const userSql = `
        SELECT email
        FROM ${dbName}
        WHERE id = ?
        LIMIT 1;
      `;
  const [user] = await dbCon.query(userSql, [userId]);

  if (user.length === 0) {
    return null; // User not found
  }

  return user[0].email;
}

async function changePhone(req, res) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userType = decoded.userType;
    const userId = decoded.userId;

    const newPhone = req.body.phone;

    if (await registerController.userPhoneExists(userType, newPhone)) {
      return res
        .status(409)
        .json({ message: "Телефонскиот број е веќе искористен" });
    }

    const dbTable = userTypeToDbTableName(userType);

    const updateSql = `
      UPDATE ${dbTable}
      SET phone_num = ?
      WHERE id = ?;
    `;
    await dbCon.query(updateSql, [newPhone, userId]);
    return res
      .status(200)
      .json({ message: "Phone number updated successfully" });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or expired token" });
    } else {
      console.error("Error when changing phone", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
module.exports = { getUserEmail, changePhone };
