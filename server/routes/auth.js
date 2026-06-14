const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { sendPasswordResetOtp } = require("../config/mailer");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;
    const selectedRole = ["farmer", "transporter"].includes(role) ? role : "farmer";

    if (!name || !phone || !password) {
      return res.status(400).json({ error: "Name, phone, and password are required" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      role: selectedRole,
      authProvider: "local",
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ error: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.log(err);
    res.json({ error: "Server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const identifier = (req.body.identifier || "").trim();

    if (!identifier) {
      return res.status(400).json({ error: "Phone number or email is required" });
    }

    const user = await User.findOne({
      $or: [
        { phone: identifier },
        { email: identifier.toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "No account found with this phone or email" });
    }

    if (!user.email) {
      return res.status(400).json({ error: "This account has no email. Please contact support or login with Google/GitHub." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = await bcrypt.hash(otp, 10);
    user.resetPasswordOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendPasswordResetOtp({ to: user.email, name: user.name, otp });

    res.json({ message: "OTP sent to your registered email" });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ error: "Unable to send OTP. Check Gmail SMTP settings." });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({ error: "Identifier, OTP, and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({
      $or: [
        { phone: identifier.trim() },
        { email: identifier.trim().toLowerCase() },
      ],
    });

    if (!user || !user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
      return res.status(400).json({ error: "Please request a new OTP first" });
    }

    if (user.resetPasswordOtpExpires < new Date()) {
      return res.status(400).json({ error: "OTP expired. Please request a new one" });
    }

    const isValidOtp = await bcrypt.compare(otp, user.resetPasswordOtp);
    if (!isValidOtp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.authProvider = user.authProvider || "local";
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.json({
      message: "Password reset successfully. Logging you in now",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ error: "Unable to reset password" });
  }
});

module.exports = router;
