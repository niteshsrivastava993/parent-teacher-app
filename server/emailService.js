const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendVerificationEmail = async (user) => {
  const transporter = createTransporter();

  const verificationLink = `${process.env.FRONTEND_URL}/verify/${user._id}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Verify your Parent-Teacher App account',
    html: `
      <h2>Welcome to Parent-Teacher App, ${user.name}!</h2>
      <p>Please click the link below to verify your email:</p>
      <a href="${verificationLink}" target="_blank">Verify Email</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
