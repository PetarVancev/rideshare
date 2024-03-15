const express = require("express");
const registerController = require("../controllers/registerController");

const router = express.Router();

//Register a new passenger
router.post("/passenger", registerController.registerPassenger);

//Check if email already has an account
router.get("/passenger/check-email", async (req, res) => {
  try {
    const email = req.query.email;
    const emailExists = await registerController.userEmailExists(
      email,
      "passenger"
    );
    if (emailExists) {
      return res.status(409).json({ message: "Email already has an account" });
    } else {
      return res.status(200).json({ message: "Email available" });
    }
  } catch (error) {
    console.error("Error checking email existence:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Check if phone number already has an account
router.get("/passenger/check-phone", async (req, res) => {
  try {
    const phoneNum = decodeURIComponent(req.query.phone);
    const isPhoneExists = await registerController.userPhoneExists(
      phoneNum,
      "passenger"
    );
    if (isPhoneExists) {
      return res
        .status(409)
        .json({ message: "Phone number already has an account" });
    } else {
      return res.status(200).json({ message: "Phone number available" });
    }
  } catch (error) {
    console.error("Error checking phone number existence:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Register a new driver
router.post("/driver", registerController.registerDriver);

//Check if email already has an account
router.get("/driver/check-email", async (req, res) => {
  try {
    const email = req.query.email;
    const emailExists = await registerController.userEmailExists(
      email,
      "driver"
    );
    if (emailExists) {
      return res.status(409).json({ message: "Email  has an account" });
    } else {
      return res.status(200).json({ message: "Email available" });
    }
  } catch (error) {
    console.error("Error checking email existence:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Check if phone number already has an account
router.get("/driver/check-phone", async (req, res) => {
  try {
    const phoneNum = req.query.phone;
    const isPhoneExists = await registerController.userPhoneExists(
      phoneNum,
      "driver"
    );
    if (isPhoneExists) {
      return res
        .status(409)
        .json({ message: "Phone number already has an account" });
    } else {
      return res.status(200).json({ message: "Phone number available" });
    }
  } catch (error) {
    console.error("Error checking phone number existence:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
