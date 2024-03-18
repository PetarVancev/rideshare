const express = require("express");
const reviewsController = require("../controllers/reviewsController");

const router = express.Router();

router.get("/get-all", reviewsController.getReviews);

router.post("/post-review", reviewsController.postReview);

module.exports = router;
