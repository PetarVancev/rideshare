const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const access = {
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "ride_share",
};

// Prev user admin, database ride_share

const dbCon = mysql.createPool(access);

module.exports = dbCon;
