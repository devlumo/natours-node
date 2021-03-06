import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  console.log(options);
  // 1. Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2. Define email options

  const mailOptions = {
    from: "Luke <test@test.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Send email

  console.log("sending email");

  await transporter.sendMail(mailOptions);

  console.log("email sent");
};

export default sendEmail;
