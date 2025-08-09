const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const app = express();

//middlewares
app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  console.log("hello from the middleware👋");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const port = 3000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//route handlers

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    result: tours.length,
    data: {
      tours,
    },
  });
};

const getTourById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "failed",
      message: "no tour found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = {
    id: newId,
    ...req.body,
  };
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "failed",
      message: "no tour found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: "updated",
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "failed",
      message: "no tour found",
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet implemented",
  });
};

const getUserById = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet implemented",
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet implemented",
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet implemented",
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not yet implemented",
  });
};

//routes

app.route("/api/v1/tours").get(getAllTours).post(createTour);

app
  .route("/api/v1/tours/:id")
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

app.route("/api/v1/users").get(getAllUsers).post(createUser);
app
  .route("/api/v1/users/:id")
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

//server

app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
