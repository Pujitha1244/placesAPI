const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controllers");

const userRouter = express.Router();

userRouter.get("/", usersController.getUsers);

userRouter.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("places").not().isEmpty(),
  ],
  usersController.signUp
);
userRouter.post("/login", usersController.login);

module.exports = userRouter;
