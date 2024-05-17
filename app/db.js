const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const access = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Prev user admin, database ride_share

const dbCon = mysql.createPool(access);

module.exports = dbCon;
