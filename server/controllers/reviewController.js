const Review = require("../models/review");
const User = require("../models/user");
const mongoose = require("mongoose");

// Submit a new rating/review
exports.submitReview = async (req, res) => {
    try {
        const { revieweeId, transportRequestId, rating, comment } = req.body;
        const reviewerId = req.user.id;

        if (reviewerId === revieweeId) {
            return res.status(400).json({ error: "You cannot review yourself." });
        }

        // Upsert the review if they already left one for this specific request
        const review = await Review.findOneAndUpdate(
            { reviewer: reviewerId, reviewee: revieweeId, transportRequestId },
            { rating, comment },
            { new: true, upsert: true }
        );

        res.status(200).json(review);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "You already reviewed this." });
        }
        console.error("Error submitting review:", error);
        res.status(500).json({ error: "Server error while submitting review" });
    }
};

// Get aggregate rating and recent reviews for a user
exports.getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;

        // Calculate average rating
        const stats = await Review.aggregate([
            { $match: { reviewee: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 },
                },
            },
        ]);

        // Fetch the 5 most recent reviews
        const recentReviews = await Review.find({ reviewee: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("reviewer", "name profilePicture role");

        res.status(200).json({
            averageRating: stats.length > 0 ? stats[0].averageRating : 0,
            totalReviews: stats.length > 0 ? stats[0].totalReviews : 0,
            recentReviews,
        });
    } catch (error) {
        console.error("Error fetching user reviews:", error);
        res.status(500).json({ error: "Server error while fetching reviews" });
    }
};
