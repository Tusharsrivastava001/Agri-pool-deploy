const nodemailer = require("nodemailer");

const createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("Gmail SMTP credentials are not configured");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

const sendPasswordResetOtp = async ({ to, name, otp }) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"FreshAgriPool" <${process.env.GMAIL_USER}>`,
    to,
    subject: "FreshAgriPool password reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
        <h2 style="color: #047857;">FreshAgriPool Password Reset</h2>
        <p>Hi ${name || "there"},</p>
        <p>Your password reset OTP is:</p>
        <div style="font-size: 32px; font-weight: 800; letter-spacing: 8px; background: #ecfdf5; color: #047857; padding: 16px; text-align: center; border-radius: 8px;">
          ${otp}
        </div>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendPasswordResetOtp };
