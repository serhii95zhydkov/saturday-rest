const nodemailer = require("nodemailer");

async function sendEmail({ userName, userEmail, userText }) {
  const transporter = nodemailer.createTransport({
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  const emailTemplate = `<p style="color:blue">Ви отримали листа від ${userName}</p>
    <p>Його контактна пошта - ${userEmail}</p>
    <p style="color: green">${userText}</p>
    <p>Дякуємо!</p>`;

  const info = await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: process.env.CLIENT_EMAIL,
    subject:
      "Kyiv, May 10, 19:00 Business center Parus First All-Ukrainian Jedi Conference", // Subject line
    text: userText,
    html: emailTemplate,
  });

  console.log("Message sent: %s", info.messageId);

  return true;
}

module.exports = sendEmail;
