const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

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
  const place = DUMMY_PLACES.find((p) => p.id === placeId);
  console.log("GET Request");
  //   if (!place) {
  //     const error = new Error("Could not find a place for the provided Id.");
  //     error.code = 404;
  //     throw error;
  //   }
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided Id.", 404)
    );
  }

  console.log("GET Request");
  res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const place = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided user Id.", 404)
    );
  }

  res.json({ place });
};

const createPlace = (req, res) => {
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("is JSON?:", req.is("application/json"));
  console.log("Raw body (parsed):", req.body);
  const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   throw new HttpError("Invalid Inputs passed", 422);
  // }
  console.log(req.body);
  const { title, description, address, creator, coordinates } = req.body;
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);
  //   res.send(createdPlace)

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid Inputs passed", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res) => {
  const placeid = req.params.id;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id === placeid);
  res.status(200).json({ message: "Place deleted succesfully" });
};

module.exports = {
  getPlaceById,
  getPlaceByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
