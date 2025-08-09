const express = require("express");
const tourController = require("./../controllers/tourController");
const router = express.Router();
const authController = require("./../controllers/authController");
const reviewRouter = require("./../routes/reviewRoutes");

const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
} = tourController;

const { protect, restrictTo } = authController;

// router.param("id", checkId);

//nested post route /tour/252526/reviews
//get /tour/52525/reviews
//get /tour/366373/reviews/73737

router.use("/:tourId/reviews", reviewRouter);

//checkBody middleware if name and price exist
router.route("/tour-stats").get(getTourStats);
router
  .route("/monthly-plan/:year")
  .get(protect, restrictTo("admin", "lead-guide", "guide"), getMonthlyPlan);
router.route("/top-5").get(aliasTopTours, getAllTours);

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(getToursWithin);
// /tours-within?distance=222&center=40,45&unit=km
// /tours-within/233/center/40,45/unit/km

router.route("/distances/:latlng/unit/:unit").get(getDistances);

router
  .route("/")
  .get(getAllTours)
  .post(protect, restrictTo("admin", "lead-guide"), createTour);
router
  .route("/:id")
  .get(getTourById)
  .patch(protect, restrictTo("admin", "lead-guide"), updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

//nested post route /tour/252526/reviews
//get /tour/52525/reviews
//get /tour/366373/reviews/73737

module.exports = router;
