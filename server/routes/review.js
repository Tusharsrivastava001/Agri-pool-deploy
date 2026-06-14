const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const passport = require("passport");

// Protect all review routes with JWT
router.use(passport.authenticate("jwt", { session: false }));

// Submit a review
router.post("/", reviewController.submitReview);

// Get user reviews
router.get("/:userId", reviewController.getUserReviews);

module.exports = router;
