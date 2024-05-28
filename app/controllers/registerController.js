const bcrypt = require("bcrypt");
const dbCon = require("../db");

function userTypeToDbTableName(userType) {
  if (userType == "passenger") {
    return "passenger_accounts";
  } else {
    return "driver_accounts";
  }
}

// Check if user with the provided email exists in the database
async function userEmailExists(email, userType) {
  try {
    const tableName = userTypeToDbTableName(userType);
    const sql = `SELECT * FROM ${tableName} WHERE email = ? LIMIT 1`;
    const [results] = await dbCon.query(sql, [email]);
    const userExists = results.length > 0;
    return userExists;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
}

// Check if user with the provided email exists in the database
async function userPhoneExists(phoneNum, userType) {
  try {
    const tableName = userTypeToDbTableName(userType);
    const sql = `SELECT * FROM ${tableName} WHERE phone_num = ? LIMIT 1`;
    const [results] = await dbCon.query(sql, [phoneNum]);
    const userExists = results.length > 0;
    return userExists;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
}

async function registerUser(userType, req, res) {
  try {
    const { phone_num, email, name, surname, password } = req.body;

    // Check if email already exists
    if (await userEmailExists(email, userType)) {
      // return res.status(409).json({
      //   message: "Email already exists",
      // });
      return res.status(409).json({
        message: "E-пошта веќе има профил за избраниот вид на корисник",
      });
    }

    // Check if phone_num already exists
    if (await userPhoneExists(phone_num, userType)) {
      // return res.status(409).json({ message: "Phone number already exist" });
      return res
        .status(409)
        .json({ message: "Телефонскиот број веќе има профил" });
    }

    // Encrypt the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const tableName = userTypeToDbTableName(userType);
    const sql = `INSERT INTO ${tableName} (phone_num, email, name, surname, password) 
                 VALUES (?, ?, ?, ?, ?)`;
    await dbCon.query(sql, [phone_num, email, name, surname, hashedPassword]);

    // Respond with success message
    res.status(201).json({ message: `${userType} registered successfully` });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function registerPassenger(req, res) {
  return await registerUser("passenger", req, res);
}

async function registerDriver(req, res) {
  return await registerUser("driver", req, res);
}

module.exports = {
  registerPassenger,
  registerDriver,
  userEmailExists,
  userPhoneExists,
  userTypeToDbTableName,
};
