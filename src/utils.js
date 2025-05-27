/**
 * Calculate the distance between two points using the Haversine formula
 * @param {number} lat1 - Latitude of first point in degrees
 * @param {number} lon1 - Longitude of first point in degrees
 * @param {number} lat2 - Latitude of second point in degrees
 * @param {number} lon2 - Longitude of second point in degrees
 * @returns {number} Distance in kilometers
 */

const db = require('./db');


function calculateDistance(lat1, lon1, lat2, lon2) {
  // Convert latitude and longitude from degrees to radians
  const toRadians = (degrees) => degrees * Math.PI / 180;
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  lat1 = toRadians(lat1);
  lat2 = toRadians(lat2);
  
  // Haversine formula
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  // Earth's radius in kilometers
  const R = 6371;
  
  // Distance in kilometers
  return R * c;
}

/**
 * Validate school data
 * @param {Object} schoolData - School data to validate
 * @returns {Object} Validation result with isValid flag and error message
 */
async function validateSchoolData(schoolData, db) {
  const { name, address, latitude, longitude } = schoolData;

  // ✅ Validate 'name'
  if (!name || typeof name !== "string" || name.trim().length < 3) {
    return {
      isValid: false,
      message: "Name is required and must be at least 3 characters long",
    };
  }

  // ✅ Validate 'address'
  if (!address || typeof address !== "string" || address.trim().length < 5) {
    return {
      isValid: false,
      message: "Address is required and must be at least 5 characters long",
    };
  }

  // ✅ Check if coordinates are provided
  if (
    latitude === undefined ||
    longitude === undefined ||
    latitude === null ||
    longitude === null ||
    latitude === "" ||
    longitude === ""
  ) {
    return {
      isValid: false,
      message: "Latitude and longitude are required and must not be empty",
    };
  }

  // ✅ Parse and validate coordinates
  const lat =
    typeof latitude === "string" ? parseFloat(latitude.trim()) : latitude;
  const lon =
    typeof longitude === "string" ? parseFloat(longitude.trim()) : longitude;

  if (
    typeof lat !== "number" ||
    isNaN(lat) ||
    !isFinite(lat) ||
    lat < -90 ||
    lat > 90
  ) {
    return {
      isValid: false,
      message: "Latitude must be a valid number between -90 and 90",
    };
  }

  if (
    typeof lon !== "number" ||
    isNaN(lon) ||
    !isFinite(lon) ||
    lon < -180 ||
    lon > 180
  ) {
    return {
      isValid: false,
      message: "Longitude must be a valid number between -180 and 180",
    };
  }

  // ✅ Duplicate check by name and address
  try {
    
    if (!db || typeof db.execute !== "function") {
      return {
        isValid: false,
        message: "Database connection is not available",
      };
    }

    const [rows] = await db.execute(
      "SELECT id FROM schools WHERE name = ? AND address = ?",
      [name.trim(), address.trim()]
    );

    if (rows.length > 0) {
      return {
        isValid: false,
        message: "School with the same name and address already exists",
      };
    }
  } catch (error) {
    console.error("DB Error in validation:", error);
    return { isValid: false, message: "Error checking for duplicates" };
  }

  // ✅ All good
  return { isValid: true, lat, lon };
}



/**
 * Validate location coordinates
 * @param {number} latitude - Latitude to validate
 * @param {number} longitude - Longitude to validate
 * @returns {Object} Validation result with isValid flag and error message
 */
function validateCoordinates(latitude, longitude) {
  // ✅ Check if both values are provided and not null/empty
  if (
    latitude === undefined ||
    longitude === undefined ||
    latitude === null ||
    longitude === null ||
    latitude === "" ||
    longitude === ""
  ) {
    return {
      isValid: false,
      message: "Latitude and longitude are required and must not be empty",
    };
  }

  // ✅ Trim and parse strings if needed
  const lat =
    typeof latitude === "string" ? parseFloat(latitude.trim()) : latitude;
  const lon =
    typeof longitude === "string" ? parseFloat(longitude.trim()) : longitude;

  // ✅ Validate latitude
  if (
    typeof lat !== "number" ||
    isNaN(lat) ||
    !isFinite(lat) ||
    lat < -90 ||
    lat > 90
  ) {
    return {
      isValid: false,
      message: "Latitude must be a valid number between -90 and 90",
    };
  }

  // ✅ Validate longitude
  if (
    typeof lon !== "number" ||
    isNaN(lon) ||
    !isFinite(lon) ||
    lon < -180 ||
    lon > 180
  ) {
    return {
      isValid: false,
      message: "Longitude must be a valid number between -180 and 180",
    };
  }

  // ✅ Return clean and valid values
  return { isValid: true, lat, lon };
}


module.exports = {
  calculateDistance,
  validateSchoolData,
  validateCoordinates
};


