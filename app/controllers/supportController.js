const nodemailer = require("nodemailer");

const sendContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GMAIL_PASSWORD,
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
