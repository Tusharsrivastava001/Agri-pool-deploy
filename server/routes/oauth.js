const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const redirectWithToken = (req, res) => {
  const user = req.user;
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const params = new URLSearchParams({
    accessToken,
    userId: user._id.toString(),
    name: user.name || "Farmer",
    role: user.role || "farmer",
    email: user.email || "",
    picture: user.profilePicture || "",
  });

  res.redirect(`${CLIENT_URL}/?${params.toString()}`);
};

router.get("/google", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${CLIENT_URL}/login?error=google_oauth_not_configured`);
  }
  passport.authenticate("google", { scope: ["profile", "email"], session: false })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}/login?error=google_login_failed`,
    session: false,
  }),
  redirectWithToken
);

router.get("/github", (req, res, next) => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return res.redirect(`${CLIENT_URL}/login?error=github_oauth_not_configured`);
  }
  passport.authenticate("github", { scope: ["user:email"], session: false })(req, res, next);
});

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${CLIENT_URL}/login?error=github_login_failed`,
    session: false,
  }),
  redirectWithToken
);

module.exports = router;
