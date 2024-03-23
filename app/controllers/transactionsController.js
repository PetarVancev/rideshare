async function payToDriver(
  connection,
  fromPassenger,
  toDriver,
  rideId,
  amount
) {
  const percentWeCharge = 0.25;
  try {
    const getDriverBalanceQuery =
      "SELECT balance FROM driver_accounts WHERE id = ?";
    const [driver] = await connection.query(getDriverBalanceQuery, [toDriver]);

    if (driver.length === 0) {
      throw new Error("Driver not found");
    }

    amount = amount * (1 - percentWeCharge);
    const currentBalance = driver[0].balance;
    const newBalance = currentBalance + amount;

    const updateDriverBalanceQuery =
      "UPDATE driver_accounts SET balance = ? WHERE id = ?";
    await connection.query(updateDriverBalanceQuery, [newBalance, toDriver]);

    const currentDateTime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const insertTransactionQuery =
      "INSERT INTO transactions (from_passenger_id, to_driver_id, ride_id, amount, date_time) VALUES (?, ?, ?, ?, ?)";
    await connection.query(insertTransactionQuery, [
      fromPassenger,
      toDriver,
      rideId,
      amount,
      currentDateTime,
    ]);
  } catch (error) {
    throw new Error(
      `Error while processing payment to driver: ${error.message}`
    );
  }
}

module.exports = { payToDriver };
