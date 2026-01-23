const express = require("express");
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");
const { signup } = require("../controllers/authControllers");

const router = express.Router();

router.post("/signup", signup);

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
