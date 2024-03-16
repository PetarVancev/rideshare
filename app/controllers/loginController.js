const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const dbCon = require("../db");
const userTypeToDbTableName =
  require("./registerController").userTypeToDbTableName;

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
      return res.status(401).json({ message: "Invalid email" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If email and password are valid, create a JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "6h", // Token expiration
      }
    );

    // Respond with the token
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function loginPassenger(req, res) {
  return await loginUser("passenger", req, res);
}

async function loginDriver(req, res) {
  return await loginUser("driver", req, res);
}

module.exports = { loginPassenger, loginDriver };
