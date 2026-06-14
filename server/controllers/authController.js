const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "default_access_secret",
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      phone,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
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

    const { accessToken, refreshToken } = generateTokens(user);

    res.json({
      message: "Login success",
      token: accessToken, // Retained for backwards compatibility
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    console.log(err);
    res.json({ error: "Server error" });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token is required" });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "default_refresh_secret", async (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid or expired refresh token" });
      
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      const tokens = generateTokens(user);
      res.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        token: tokens.accessToken // backwards compatibility
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};
