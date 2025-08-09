const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require("../models/userModel");
// const validator = require("validator");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: [true, "Name already taken"],
      trim: true,
      maxLength: [40, "A tour name must have 40 or less characters"],
      minLength: [10, "A tour name must have 10 or more characters"],
      // validate: [validator.isAlpha, "tour name must contain only alphabets"],
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    slug: {
      type: String,
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "difficulty must be either easy, medium or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "a tour must have 1.0 or more rating"],
      max: [5, "a tour must have 5.0 or less rating"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          //this only points to current doc on NEW document creation
          return value < this.price;
        },
        message: "discount ({VALUE}) must be less than actual price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

//Document middleware : runs before .save() and .create()
//pre middleware
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//embedding

// tourSchema.pre("save", async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre("save", function (next) {
//   console.log("will save document...");
//   next();
// });

// //post middleWare
// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

//query middleware : runs before .find()
//pre middleware
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre("/^find/", function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v",
  });
  next();
});

//post middleware
tourSchema.post(/^find/, function (docs, next) {
  console.log(`query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

//aggregation middleware : runs before
//pre middleware
// tourSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({
//     $match: {
//       secretTour: { $ne: true },
//     },
//   });
//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
