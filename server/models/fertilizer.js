const mongoose = require("mongoose");

const fertilizerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  landSize: { type: Number, required: true },
  crop: { type: String, required: true },
  soilType: { type: String, required: true },
  season: { type: String, required: true },
  aiResponse: {
    fertilizers: [{ name: String, quantity: String, purpose: String }],
    schedule: [String],
    warnings: [String],
    summary: String
  },
}, { timestamps: true });

module.exports = mongoose.model("Fertilizer", fertilizerSchema);
