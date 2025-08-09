const path = require("path");
const express = require("express");
// const qs = require("qs");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

// app.set("query parser", (str) => qs.parse(str));

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
//1 global middlewares

//serving static file
app.use(express.static(path.join(__dirname, "public")));

//set security http headers
app.use(helmet());

//development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "too many request from this IP, please try again in an hour",
});
app.use("/api", limiter);

//body parser, reading data from body into req.body
app.use(
  express.json({
    limit: "10kb",
  })
);
app.use(cookieParser());

//data sanitization against Nosql query injection

//data sanitization against XSS

//test middleware
app.use((req, res, next) => {
  console.log("hello from the middleware👋");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  // console.log(req.headers);s
  next();
});

// doesnot need it in express version 4

// app.use((req, res, next) => {
//   Object.defineProperty(req, "query", {
//     ...Object.getOwnPropertyDescriptor(req, "query"),
//     value: req.query,
//     writable: true,
//   });
//   next();
// });

// app.use((req, res, next) => {
//   req.query = { ...req.query }; //shallow clone, now it's mutable
//   next();
// });

//routes

//mounting the router in middleware
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
