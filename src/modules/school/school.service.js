import { insertSchool, findAllSchools } from "./school.repository.js";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const addSchool = async (schoolData) => {
  const { name, address, latitude, longitude } = schoolData;

  if (
    !name ||
    !address ||
    latitude === undefined ||
    longitude === undefined
  ) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }

  if (typeof name !== "string" || name.trim().length === 0) {
    const error = new Error("Name must be a non-empty string");
    error.statusCode = 400;
    throw error;
  }

  if (typeof address !== "string" || address.trim().length === 0) {
    const error = new Error("Address must be a non-empty string");
    error.statusCode = 400;
    throw error;
  }

  if (typeof latitude !== "number" || latitude < -90 || latitude > 90) {
    const error = new Error("Latitude must be a number between -90 and 90");
    error.statusCode = 400;
    throw error;
  }

  if (typeof longitude !== "number" || longitude < -180 || longitude > 180) {
    const error = new Error("Longitude must be a number between -180 and 180");
    error.statusCode = 400;
    throw error;
  }

  const result = await insertSchool({
    name: name.trim(),
    address: address.trim(),
    latitude,
    longitude,
  });

  return { id: result.insertId, name: name.trim(), address: address.trim(), latitude, longitude };
};

const listSchools = async (userLat, userLon) => {
  if (userLat === undefined || userLon === undefined) {
    const error = new Error("Latitude and longitude query parameters are required");
    error.statusCode = 400;
    throw error;
  }

  const lat = parseFloat(userLat);
  const lon = parseFloat(userLon);

  if (isNaN(lat) || lat < -90 || lat > 90) {
    const error = new Error("Latitude must be a valid number between -90 and 90");
    error.statusCode = 400;
    throw error;
  }

  if (isNaN(lon) || lon < -180 || lon > 180) {
    const error = new Error("Longitude must be a valid number between -180 and 180");
    error.statusCode = 400;
    throw error;
  }

  const schools = await findAllSchools();

  const schoolsWithDistance = schools.map((school) => ({
    ...school,
    distance: parseFloat(
      calculateDistance(lat, lon, school.latitude, school.longitude).toFixed(2)
    ),
  }));

  schoolsWithDistance.sort((a, b) => a.distance - b.distance);

  return schoolsWithDistance;
};

export { addSchool, listSchools };
