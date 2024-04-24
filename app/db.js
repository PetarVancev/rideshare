const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const access = {
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "rideshare",
};

// Prev user admin, database ride_share

const dbCon = mysql.createPool(access);

module.exports = dbCon;
