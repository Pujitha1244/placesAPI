const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");

const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Poojitha",
    email: "pooji@gmail.com",
    password: "pooji@123$",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid Inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password, places } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({
      email: email,
    });
  } catch (err) {
    const error = new HttpError("Siging Up failed please try again later", 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError("User already exists, Please login", 422);
    return next(error);
  }

  // const hasUser = DUMMY_USERS.find((u) => u.email === email);
  // if (hasUser) {
  //   throw new HttpError("User Already exists, please login", 401);
  // }

  const createdUser = new User({
    name,
    email,
    image:
      "https://www.indiantempletour.com/wp-content/uploads/2022/08/Andaman-and-Nicobar-Islands-Package-1.jpg",
    password,
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Sign up Failed, please try again", 500);
    return next(error);
  }

  // DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Could not identify the user", 401);
  }

  res.json({ message: "User LoggedIn" });
};

module.exports = { getUsers, signUp, login };
