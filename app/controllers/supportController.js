const nodemailer = require("nodemailer");

const sendContactForm = async (req, res) => {
  const { name, email, message } = req.body;

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
    from: email,
    to: "contact@rideshare.mk",
    subject: `Контакт форма испратена од ${name}`,
    text: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: `Email sent: ${info.response}` });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Error sending email: ${error.toString()}` });
  }
};

module.exports = { sendContactForm };
