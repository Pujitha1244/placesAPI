const express = require("express");
const mongoose = require("mongoose");

const placesRouter = require("./routes/places-routes");
const usersRouter = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(express.json());

app.use("/api/places", placesRouter);
app.use("/api/users", usersRouter);

app.use((req, res, next) => {
  const error = new HttpError("Cound not find this route", 404);
  throw error;
});

// Error handling Middleware
app.use((error, req, res, next) => {
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

mongoose
  .connect(
    "mongodb+srv://pujithavankadari1244_db_user:SagarJaini123@namastenode.rxxns9u.mongodb.net/places"
  )
  .then(() => {
    app.listen(5000, () => {
      console.log("Database connection established");
      console.log("Server is succesfully listening on port 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
