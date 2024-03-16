const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const dbCon = require("../db");
const findUserByEmail = require("./loginController").findUserByEmail;
const userTypeToDbTableName =
  require("./registerController").userTypeToDbTableName;

async function verifyResetToken(userType, email, resetToken) {
  try {
    const user = await findUserByEmail(userType, email);
    const sql = `SELECT * FROM password_reset_tokens WHERE ${userType}_id = ? AND token = ? AND expires_at > NOW()`;
    const [rows] = await dbCon.query(sql, [user.id, resetToken]);

    return rows.length > 0;
  } catch (error) {
    console.error("Error verifying reset token:", error);
    throw error;
  }
}

async function deleteResetToken(token) {
  try {
    const sql = `DELETE FROM password_reset_tokens WHERE token = ?`;
    await dbCon.query(sql, [token]);
  } catch (error) {
    console.error("Error deleting reset token:", error);
    throw error;
  }
}

async function handlePasswordReset(userType, req, res) {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await findUserByEmail(userType, email);

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "pvancev@gmail.com",
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: email,
      subject: "Reset Your Password",
      text:
        `You are receiving this email because you (or someone else) have requested to reset the password for your account.\n\n` +
        `Please click on the following link to reset your password: ${
          process.env.CLIENT_URL
        }/reset/${token}?expires=${expirationTime.getTime()}\n\n` +
        `This link will expire in 1 hour.\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    const sql = `INSERT INTO password_reset_tokens (${userType}_id, token, expires_at) VALUES (?, ?, ?)`;
    await dbCon.query(sql, [user.id, token, expirationTime]);

    res
      .status(200)
      .json({ message: "Password reset email sent", token: token });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function requestPassengerPasswordReset(req, res) {
  return await handlePasswordReset("passenger", req, res);
}

async function requestDriverPasswordReset(req, res) {
  return await handlePasswordReset("driver", req, res);
}

async function resetPassword(userType, req, res) {
  const { email, resetToken, newPassword } = req.body;

  try {
    // Verify the reset token
    const isValidToken = await verifyResetToken(userType, email, resetToken);

    if (!isValidToken) {
      return res.status(400).json({ error: "Invalid reset token" });
    }

    //TO DO, can make migarte salt rounds in env as it is used in other controllers
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const tableName = userTypeToDbTableName(userType);
    const user = await findUserByEmail(userType, email);
    const sql = `UPDATE ${tableName} SET password = ? WHERE id = ?`;
    await dbCon.query(sql, [hashedPassword, user.id]);

    await deleteResetToken(resetToken);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function resetPassengerPassword(req, res) {
  return await resetPassword("passenger", req, res);
}

async function resetDriverPassword(req, res) {
  return await resetPassword("driver", req, res);
}

module.exports = {
  requestPassengerPasswordReset,
  requestDriverPasswordReset,
  resetPassengerPassword,
  resetDriverPassword,
};
