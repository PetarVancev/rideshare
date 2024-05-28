const dbCon = require("../db");

async function getLocation(locationId) {
  try {
    const sql = `
      SELECT 
        l.id,
        l.name,
        l.parent_location_id,
        l.location_lat,
        l.location_lon
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
      res.status(404).json({ message: "Локацијата не постои" });
    } else {
      res.json(results);
    }
  } catch (error) {
    console.error("Error getting autocomplete suggestions:", error);
    // res.status(500).json({ message: "Internal server error" });
    return res.status(500).json({ error: "Дојде до грешка во серверот" });
  }
}

async function getLocationApi(req, res) {
  try {
    const locationId = req.query.locationId;
    const location = await getLocation(locationId);

    if (location.length > 0) {
      res.status(200).json(location[0]);
    } else {
      // res.status(404).json({ message: "No matching location" });
      res.status(404).json({ message: "Локацијата не постои" });
    }
  } catch (error) {
    console.error("Error when getting location:", error);
    // res.status(500).json({ error: "Internal server error" });
    return res.status(500).json({ error: "Дојде до грешка во серверот" });
  }
}

module.exports = { locationsLookup, getLocation, getLocationApi };
