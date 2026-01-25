const express = require("express");
const {
  getAllReviews,
  createReview,
} = require("../controllers/reviewControllers");
const { protect, restrictTo } = require("../controllers/authControllers");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), createReview);

module.exports = router;
