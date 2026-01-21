const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // if (id > tours.length - 1) {
  if (!tour) {
    res.status(404).json({
      status: "failed",
      message: "Tour not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = {
    id: newId,
    ...req.body,
  };

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: "success",
        message: "Successfully added a tour.",
        data: {
          tour: newTour,
        },
      });
    },
  );
};

exports.updateTour = (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length - 1) {
    // if (!tour) {
    res.status(404).json({
      status: "failed",
      message: "Tour not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: "tour",
    },
  });
};

exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length - 1) {
    // if (!tour) {
    res.status(404).json({
      status: "failed",
      message: "Tour not found",
    });
  }

  res.status(204).json({
    status: "success",
  });
};
