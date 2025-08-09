const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({
  path: "./.env",
});

console.log(process.env.DATABASE);

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db connection successful");
  });

const app = require("./app");

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

// not necessary better handle it where required using catch block

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION: SHUTTING DOWN...");
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTIONS: SHUTTING DOWN...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
