const dbCon = require("../db");

async function getLocation(locationId) {
  try {
    const sql = `
      SELECT 
        l.id,
        l.name,
        l.parent_location_id
      FROM 
        locations AS l
      WHERE 
        l.id = ?
    `;

    const [locations] = await dbCon.query(sql, [locationId]);
    return locations;
  } catch (error) {
    console.error("Error when retrieving locations:", error);
    throw error;
  }
}

async function locationsLookup(req, res) {
  try {
    const geoName = req.query.name;
    const [results] = await dbCon.query(
      "SELECT id, name FROM locations WHERE name LIKE ? LIMIT 10",
      [geoName + "%"]
    );
    if (results.length == 0) {
      res.status(404).json({ message: "No matching location" });
    } else {
      res.json(results);
    }
  } catch (error) {
    console.error("Error getting autocomplete suggestions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { locationsLookup, getLocation };
