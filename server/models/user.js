const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true,
  },
  profilePicture: String,
  authProvider: {
    type: String,
    enum: ["local", "google", "github"],
    default: "local",
  },
  resetPasswordOtp: String,
  resetPasswordOtpExpires: Date,
  role: {
    type: String,
    enum: ["farmer", "transporter", "admin"],
    default: "farmer"
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
