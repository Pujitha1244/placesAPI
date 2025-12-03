const express = require("express");
const { check } = require("express-validator");
const controllers = require("../controllers/places-controllers");

const {
  getPlaceById,
  getPlaceByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = controllers;

const placesRouter = express.Router();

placesRouter.get("/user/:uid", getPlaceByUserId);
placesRouter.get("/:pid", getPlaceById);

placesRouter.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  updatePlace
);

placesRouter.delete("/:pid", deletePlace);

placesRouter.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);

module.exports = placesRouter;
