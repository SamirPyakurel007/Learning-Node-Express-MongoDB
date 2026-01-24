const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "review is required"],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, "A rating must be 1 or more"],
      max: [5, "A rating must be 5 or less"],
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    tour: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "A review must belong to a tour"],
      },
    ],
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "A review must belong to a user"],
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
