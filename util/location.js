const axios = require("axios");
const HttpError = require("../models/http-error");

// NOTE: For production, move the API key to an environment variable and don't commit it to source control.
const API_KEY = "AIzaSyDfiFKTfPl_BzfcSFkLybPlxiKk0RloPL8";

async function getCoordsForAddress(address) {
  let response;
  try {
    response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${API_KEY}`
    );
  } catch (err) {
    throw new HttpError(
      "Failed to connect to geocoding service. Please try again later.",
      500
    );
  }

  const data = response.data;

  // Defensive checks: ensure the API returned usable results
  if (!data) {
    throw new HttpError("Invalid response from geocoding service.", 500);
  }

  if (data.status === "ZERO_RESULTS") {
    throw new HttpError(
      "Could not find location for the specified address.",
      422
    );
  }

  if (data.status !== "OK") {
    // If Google returns an error message include it when available
    const message = data.error_message || "Geocoding failed.";
    throw new HttpError(message, 500);
  }

  if (
    !data.results ||
    !Array.isArray(data.results) ||
    data.results.length === 0 ||
    !data.results[0].geometry ||
    !data.results[0].geometry.location
  ) {
    throw new HttpError(
      "Could not find location for the specified address (missing geometry).",
      422
    );
  }

  const coordinates = data.results[0].geometry.location;
  return coordinates;
}

module.exports = getCoordsForAddress;
