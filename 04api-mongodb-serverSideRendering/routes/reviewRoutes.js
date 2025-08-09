const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("./../controllers/authController");

//get /tour/52525/reviews
//post /reviews
const router = express.Router({ mergeParams: true });

const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserId,
  getReview,
} = reviewController;
const { protect, restrictTo } = authController;

router.use(protect);

router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user"), setTourUserId, createReview);

router
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("user", "admin"), updateReview)
  .delete(restrictTo("user", "admin"), deleteReview);

module.exports = router;
