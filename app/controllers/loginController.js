const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dbCon = require("../db");

const userTypeToDbTableName =
  require("./registerController").userTypeToDbTableName;
const getReviewsAverage =
  require("./reviewsController").getDriverReviewsAverage;

async function findUserByEmail(userType, email) {
  try {
    const tableName = userTypeToDbTableName(userType);
    const sql = `SELECT id,email,password FROM ${tableName} WHERE email = ? LIMIT 1`;
    const [results] = await dbCon.query(sql, [email]);
    const user = results[0];
    return user;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
}

async function loginUser(userType, req, res) {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await findUserByEmail(userType, email);

    // Check if the user exists
    if (!user) {
      // return res.status(401).json({ message: "Invalid email" });
      return res.status(401).json({ message: "Невалидна е-пошта" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // return res.status(401).json({ message: "Invalid password" });
      return res.status(401).json({ message: "Погрешна лозинка" });
    }

    // If email and password are valid, create a JWT token
    const token = jwt.sign(
      { userId: user.id, userType: userType, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "90d", // Token expiration
      }
    );

    // Respond with the token
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    // res.status(500).json({ message: "Internal Server Error" });
    return res.status(500).json({ error: "Дојде до грешка во серверот" });
  }
}

async function getUserFromToken(req, res) {
  const token = req.headers.authorization;
  if (!token) {
    // return res.status(401).json({ error: "Unauthorized: Token missing" });
    return res
      .status(401)
      .json({ error: "Неавторизирано: Недостига токен за најава" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userType = decoded.userType;
    const userId = decoded.userId;

    let sql =
      "SELECT name,phone_num, email FROM passenger_accounts WHERE id = ?";
    if (userType == "driver") {
      sql = "SELECT name,phone_num, email FROM driver_accounts WHERE id = ?";
    }
    const [userInfo] = await dbCon.query(sql, [userId]);
    const reviewsAverage = await getReviewsAverage(userType, userId);
    userInfo[0].averageReviewScore = reviewsAverage;
    return res.status(200).json(userInfo[0]);
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      // return res
      //   .status(401)
      //   .json({ error: "Unauthorized: Invalid or expired token" });
      return res.status(401).json({
        error: "Неавторизирано: Токенот за најава е невалиден",
      });
    } else {
      console.error("Error when withdrawing:", error);
      // return res.status(500).json({ error: "Internal Server Error" });
      return res.status(500).json({ error: "Дојде до грешка во серверот" });
    }
  }
}

async function loginPassenger(req, res) {
  return await loginUser("passenger", req, res);
}

async function loginDriver(req, res) {
  return await loginUser("driver", req, res);
}

module.exports = {
  loginPassenger,
  loginDriver,
  findUserByEmail,
  getUserFromToken,
};
