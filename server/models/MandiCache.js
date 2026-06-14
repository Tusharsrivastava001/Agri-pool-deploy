const mongoose = require("mongoose");

const mandiCacheSchema = new mongoose.Schema(
  {
    state: { type: String, required: true, index: true },
    commodity: { type: String, index: true },
    records: { type: Array, default: [] },
    fetchedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MandiCache", mandiCacheSchema);
