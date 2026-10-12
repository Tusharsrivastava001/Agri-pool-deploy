const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/user");

const normalizeBaseUrl = (value, fallback) => {
  if (!value) return fallback;
  return value.replace(/\/+$/, "");
};

const SERVER_ROOT = normalizeBaseUrl(
  process.env.SERVER_ROOT ||
    process.env.BACKEND_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""),
  "http://localhost:5000"
);

const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || `${SERVER_ROOT}/api/oauth/google/callback`;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL || `${SERVER_ROOT}/api/oauth/github/callback`;

console.log("[passport] Google callback URL:", GOOGLE_CALLBACK_URL);
console.log("[passport] GitHub callback URL:", GITHUB_CALLBACK_URL);

const upsertOAuthUser = async ({ provider, providerId, name, email, profilePicture }) => {
  const providerField = provider === "google" ? "googleId" : "githubId";
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  let user = await User.findOne({ [providerField]: providerId });

  if (!user && normalizedEmail) {
    user = await User.findOne({ email: normalizedEmail });
  }

  if (!user) {
    user = new User({
      name: name || `${provider} user`,
      email: normalizedEmail || undefined,
      [providerField]: providerId,
      profilePicture,
      authProvider: provider,
      role: "farmer",
    });
  } else {
    user[providerField] = providerId;
    user.authProvider = user.authProvider || provider;
    if (!user.profilePicture && profilePicture) user.profilePicture = profilePicture;
    if (!user.email && normalizedEmail) user.email = normalizedEmail;
  }

  await user.save();
  return user;
};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await upsertOAuthUser({
            provider: "google",
            providerId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            profilePicture: profile.photos?.[0]?.value,
          });
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const primaryEmail =
            profile.emails?.find((item) => item.primary)?.value ||
            profile.emails?.[0]?.value ||
            "";

          const user = await upsertOAuthUser({
            provider: "github",
            providerId: profile.id,
            name: profile.displayName || profile.username,
            email: primaryEmail,
            profilePicture: profile.photos?.[0]?.value,
          });
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user)).catch(done);
});
