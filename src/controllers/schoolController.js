const{ pool } = require('../db');
const { calculateDistance, validateSchoolData, validateCoordinates } = require('../utils');

/**
 * Add a new school to the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function addSchool(req, res) {
  try {
    const schoolData = req.body;
    
    // Validate the input data
    const validation = await validateSchoolData(schoolData, pool);

    if (!validation.isValid) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        error: validation.message,
      });
    }
    
    const { name, address, latitude, longitude } = schoolData;
    
    // Insert the school into the database
    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    const [result] = await pool.query(query, [name, address, parseFloat(latitude), parseFloat(longitude)]);
    
    res.status(201).json({
      status: "success",
      message: "School added successfully",
      data: {
        schoolId: result.insertId,
        name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: "An unexpected error occurred. Please try again later.",
    });
  }
}

/**
 * List all schools sorted by proximity to user's location
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function listSchools(req, res) {
  try {
    const { latitude, longitude } = req.query;
    
    // Validate the coordinates
    const validation = validateCoordinates(latitude, longitude);

    if (!validation.isValid) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        error: validation.message,
      });
    }
    
    const userLat = validation.lat;
    const userLon = validation.lon;
    
    // Fetch all schools from the database
    const query = 'SELECT id, name, address, latitude, longitude FROM schools';
    const [schools] = await pool.query(query);
    
    // Calculate distance for each school and add it to the school object
    const schoolsWithDistance = schools.map((school) => {
      const distance = calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      );

      return {
        ...school,
        distance: parseFloat(distance.toFixed(2)), // Round to 2 decimal places
      };
    });
    
    
    
    // Sort schools by distance (closest first)
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);
    
    res.status(200).json({
      status: "success",
      message: "Schools fetched and sorted by proximity successfully",
      userLocation: { latitude: userLat, longitude: userLon },
      totalSchools: schoolsWithDistance.length,
      schools: schoolsWithDistance,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: "Failed to fetch schools. Please try again later.",
    });
  }
}

module.exports = {
  addSchool,
  listSchools
};
