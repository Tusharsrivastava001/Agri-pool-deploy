const axios = require("axios");
const MandiCache = require("../models/MandiCache");

const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const SIX_HOURS = 6 * 60 * 60 * 1000;

exports.getPrices = async (req, res) => {
  try {
    const state = (req.query.state || "").trim();
    const commodity = (req.query.commodity || "").trim();

    if (!state) {
      return res.status(400).json({ error: "State is required" });
    }

    const cached = await MandiCache.findOne({
      state: state.toLowerCase(),
      commodity: commodity.toLowerCase(),
      fetchedAt: { $gte: new Date(Date.now() - SIX_HOURS) },
    }).sort({ fetchedAt: -1 });

    if (cached) {
      return res.json({ source: "cache", records: cached.records });
    }

    if (!process.env.MANDI_API_KEY) {
      return res.status(500).json({ error: "Mandi API key is not configured" });
    }

    const response = await axios.get("https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070", {
      params: {
        "api-key": process.env.MANDI_API_KEY,
        format: "json",
        limit: 100,
        "filters[state]": state,
        ...(commodity ? { "filters[commodity]": commodity } : {}),
      },
      timeout: 15000,
    });

    const records = (response.data?.records || []).map((item) => ({
      commodity: item.commodity,
      market: item.market,
      state: item.state,
      minPrice: item.min_price,
      maxPrice: item.max_price,
      modalPrice: item.modal_price,
      date: item.arrival_date,
    }));

    await MandiCache.create({
      state: state.toLowerCase(),
      commodity: commodity.toLowerCase(),
      records,
      fetchedAt: new Date(),
    });

    res.json({ source: "live", resourceId: RESOURCE_ID, records });
  } catch (error) {
    console.error("Mandi error:", error.message);
    if (error.response?.status === 403) {
      return res.status(403).json({ error: "Mandi API key is invalid, expired, or not authorized for this data.gov.in resource." });
    }

    if (error.response?.status === 404) {
      return res.status(404).json({ error: "Mandi data resource was not found." });
    }

    res.status(502).json({ error: "Unable to fetch mandi prices right now" });
  }
};
