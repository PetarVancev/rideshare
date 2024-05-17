const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

const dbCon = require("./db");

// Route imports
const geoLocationRoutes = require("./routes/geoLocationRoutes");
const authRoutes = require("./routes/authRoutes");
const ridesRoutes = require("./routes/ridesRoutes");
const walletRoutes = require("./routes/walletRoutes");
const reviewsRoutes = require("./routes/reviewsRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const supportRoutes = require("./routes/supportRoutes");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "https://rideshare.mk",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const port = process.env.PORT || 3000;

// Test if db connected
dbCon.getConnection((err) => {
  if (err) {
    console.log("inside");
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
app.use("/reservations", reservationRoutes);
app.use("/complaints", complaintRoutes);
app.use("/support", supportRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
