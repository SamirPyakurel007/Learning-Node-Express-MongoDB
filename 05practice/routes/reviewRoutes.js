const express = require("express");
const {
  getAllReviews,
  createReview,
  deleteReview,
} = require("../controllers/reviewControllers");
const { protect, restrictTo } = require("../controllers/authControllers");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), createReview);

router.route("/:id").delete(deleteReview);

module.exports = router;
