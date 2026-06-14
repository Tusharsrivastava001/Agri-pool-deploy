const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reviewee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        transportRequestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TransportRequest",
            required: false, // Optional if we just want a general rating
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

// Prevent a user from reviewing the same transport request multiple times
reviewSchema.index({ reviewer: 1, reviewee: 1, transportRequestId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
