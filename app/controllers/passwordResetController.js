const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const dbCon = require("../db");
const findUserByEmail = require("./loginController").findUserByEmail;
const userTypeToDbTableName =
  require("./registerController").userTypeToDbTableName;

async function getResetTokenUser(resetToken) {
  try {
    const sql = `SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()`;
    const [rows] = await dbCon.query(sql, [resetToken]);

    return rows;
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

async function requestPasswordReset(userType, req, res) {
  const { email } = req.body;

  try {
    if (!email) {
      // return res.status(400).json({ error: "Email is required" });
      return res.status(400).json({ error: "Потребно е да внесите е-пошта" });
    }

    const user = await findUserByEmail(userType, email);

    // Check if the user exists
    if (!user) {
      // return res.status(401).json({ message: "Invalid email" });
      return res.status(401).json({ message: "Невалидна е-пошта" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1);

    const transporter = nodemailer.createTransport({
      name: "mail.rideshare.mk",
      host: "mail.rideshare.mk",
      port: 465,
      secure: true,
      auth: {
        user: "donotreply@rideshare.mk",
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "donotreply@rideshare.mk",
      to: email,
      subject: "Reset Your Password",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Промена на лозинка</title>
      </head>
      <body style="background-color: #f4f4f5;">
        <table cellpadding="0" cellspacing="0" style="width: 100%; height: 100%; background-color: #f4f4f5; text-align: center;">
          <tbody>
            <tr>
              <td style="text-align: center;">
                <table align="center" cellpadding="0" cellspacing="0" id="body" style="background-color: #fff; width: 100%; max-width: 680px; height: 100%;">
                  <tbody>
                    <tr>
                      <td>
                        <table align="center" cellpadding="0" cellspacing="0" class="page-center" style="text-align: left; padding-bottom: 88px; width: 100%; padding-left: 120px; padding-right: 120px;">
                          <tbody>
                            <tr>
                              <td style="padding-top: 24px;">
                                <img src="https://d1pgqke3goo8l6.cloudfront.net/wRMe5oiRRqYamUFBvXEw_logo.png" style="width: 56px;">
                              </td>
                            </tr>
                            <tr>
                              <td colspan="2" style="padding-top: 72px; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #022C66; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 48px; font-smoothing: always; font-style: normal; font-weight: 600; letter-spacing: -2.6px; line-height: 52px; mso-line-height-rule: exactly; text-decoration: none;">Промена на лозинка</td>
                            </tr>
                            <tr>
                              <td style="padding-top: 48px; padding-bottom: 48px;">
                                <table cellpadding="0" cellspacing="0" style="width: 100%">
                                  <tbody>
                                    <tr>
                                      <td style="width: 100%; height: 1px; max-height: 1px; background-color: #d9dbe0; opacity: 0.81"></td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="-ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #022C66; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;">
                                Оваа порака ја добивате бидејќи побаравте промена на лозинка на вашиот профил
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-top: 24px; -ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #022C66; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 16px; font-smoothing: always; font-style: normal; font-weight: 400; letter-spacing: -0.18px; line-height: 24px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 100%;">
                                Ве молиме кликнете го копчето подолу доколку сакате да го промените вашата лозинка
                                <br/>
                                Доколку не побаравте промена на лозинка игнорирајте ја оваа порака
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <a data-click-track-id="37" href=${process.env.CLIENT_URL}/reset-password?token=${token}&usertype=${userType} style="margin-top: 36px; -ms-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; color: #ffffff; font-family: 'Postmates Std', 'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; font-size: 12px; font-smoothing: always; font-style: normal; font-weight: 600; letter-spacing: 0.7px; line-height: 48px; mso-line-height-rule: exactly; text-decoration: none; vertical-align: top; width: 220px; background-color: #4AC777; border-radius: 28px; display: block; text-align: center; text-transform: uppercase" target="_blank">
                                Промени лозинка</a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table align="center" cellpadding="0" cellspacing="0" id="footer" style="background-color: #022C66; width: 100%; max-width: 680px; height: 100%;">
                  <tbody>
                    <tr>
                      <td>
                        <table align="center" cellpadding="0" cellspacing="0" class="footer-center" style="text-align: left; width: 100%; padding-left: 120px; padding-right: 120px;">
                          <tbody>
                            <tr>
                              <td colspan="2" style="padding-top: 72px; padding-bottom: 72px; width: 100%;">
                                <img src="https://d1pgqke3goo8l6.cloudfront.net/DFcmHWqyT2CXk2cfz1QB_wordmark.png" style="width: 124px; height: 20px">
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>`,
    };

    await transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log("Error occurred when sending email:", error.message);
      }
    });

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
  return await requestPasswordReset("passenger", req, res);
}

async function requestDriverPasswordReset(req, res) {
  return await requestPasswordReset("driver", req, res);
}

async function resetPassword(userType, req, res) {
  const { resetToken, newPassword } = req.body;

  try {
    // Verify the reset token
    const resetTokenUser = await getResetTokenUser(resetToken);

    if (!(resetTokenUser.length > 0)) {
      // return res.status(400).json({ error: "Invalid reset token" });
      return res.status(400).json({
        error:
          "Неисправен линк за промена на лозинка, повторно побарајте промена на лозинка",
      });
    }

    //TO DO, can make migarte salt rounds in env as it is used in other controllers
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const tableName = userTypeToDbTableName(userType);
    const idFieldName = userType + "_id";
    const userId = resetTokenUser[0][idFieldName];
    const sql = `UPDATE ${tableName} SET password = ? WHERE id = ?`;
    await dbCon.query(sql, [hashedPassword, userId]);

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
