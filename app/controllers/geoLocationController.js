const dbCon = require("../db");

async function locationsLookup(req, res) {
  try {
    const geoName = req.params.name;
    const [results] = await dbCon.query(
      "SELECT id, name FROM locations WHERE name LIKE ? LIMIT 10",
      [geoName + "%"]
    );

    res.json(results);
  } catch (error) {
    console.error("Error getting autocomplete suggestions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = locationsLookup;
