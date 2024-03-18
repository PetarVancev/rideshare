const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const dbCon = require("./db");

// Route imports
const geoLocationRoutes = require("./routes/geoLocationRoutes");
const authRoutes = require("./routes/authRoutes");
const ridesRoutes = require("./routes/ridesRoutes");
const walletRoutes = require("./routes/walletRoutes");
const reviewsRoutes = require("./routes/reviewsRoutes");

dotenv.config();

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

// Test if db connected
dbCon.getConnection((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Database connected successfully");
  }
});

// Routes
app.use("/locations", geoLocationRoutes);
app.use("/auth", authRoutes);
app.use("/rides", ridesRoutes);
app.use("/wallet", walletRoutes);
app.use("/reviews", reviewsRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
