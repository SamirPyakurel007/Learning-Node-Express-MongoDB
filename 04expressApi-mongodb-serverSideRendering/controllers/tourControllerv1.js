// const qs = require("qs");
const Tour = require("../models/tourModel");

exports.aliasTopTours = (req, res, next) => {
  console.log("middleware called");
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    //build the query

    //1 a) filtering
    const queryObj = { ...req.query };
    // console.log(queryObj);
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(queryObj);

    //1 b) advance filtering
    //{difficulty:'easy', duration:{$gte: 5}}
    //{difficulty:'easy', duration:{gte: '5'}}

    // const formattedQuery = qs.parse(queryObj);
    // console.log(formattedQuery);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));
    // console.log(req.query.sort);

    //2)sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      // console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //3) limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //4)pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    //page=2&limit=10, 1-10, page1, 11-20, page 2,...
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("this page doesnt exist");
    }

    // const query = Tour.find()
    //   .where("duration")
    //   .equals(5)
    //   .where("difficulty")
    //   .equals("easy");

    //execute the query
    const tours = await query;

    //send response
    res.status(200).json({
      status: "success",
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //Tour.findOne({_id: req.params.id})
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
