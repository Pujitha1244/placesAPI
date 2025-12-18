const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");

let DUMMY_PLACES = [
  {
    id: "P1",
    title: "Empire State Building",
    description: "One of the most famous Sky scrapers in the world",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, Ny 10001",
    creator: "u1",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided Id.", 404)
    );
  }

  console.log("GET Request");
  res.json({ place });
};

const getPlaceByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let place;
  try {
    place = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided user Id.", 404)
    );
  }

  res.json({ place });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError("Invalid Inputs passed", 422));
  }
  console.log(req.body);
  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    creator,
    image: "https://picsum.photos/200",
  });

  // DUMMY_PLACES.push(createdPlace);
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid Inputs passed", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  // const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  // const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place });
};

const deletePlace = async (req, res, next) => {
  const placeid = req.params.pid;
  console.log(placeid)
  let place;
  try {
    place = await Place.findById(placeid);
    console.log(place)
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find place.",
      500
    );
    return next(error);
  }

  try {
    await place.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Place deleted succesfully" });
};

module.exports = {
  getPlaceById,
  getPlaceByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
