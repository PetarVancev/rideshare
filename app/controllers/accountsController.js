const dbCon = require("../db");

const userTypeToDbTableName =
  require("./registerController").userTypeToDbTableName;

async function getUserEmail(userId, userType) {
  const dbName = userTypeToDbTableName(userType);
  const userSql = `
        SELECT email
        FROM ${dbName}
        WHERE id = ?
        LIMIT 1;
      `;
  const [user] = await dbCon.query(userSql, [userId]);

  if (user.length === 0) {
    return null; // User not found
  }

  return user[0].email;
}

module.exports = { getUserEmail };
