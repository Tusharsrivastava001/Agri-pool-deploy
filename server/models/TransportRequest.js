const mongoose = require("mongoose");

const transportRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cropName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    transporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cropPhotoUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "In Transit", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TransportRequest", transportRequestSchema);
