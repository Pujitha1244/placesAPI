const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email Address");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  image: {
    type: String,
  },
  places: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
