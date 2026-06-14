const axios = require("axios");
const Fertilizer = require("../models/fertilizer");

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash-latest";

const fallbackRecommendation = ({ crop, soilType, season, landSize }) => ({
  fertilizers: [
    { name: "Nitrogen (N)", quantity: `${Number(landSize) * 35} kg`, purpose: "Vegetative growth and leaf development" },
    { name: "Phosphorus (P2O5)", quantity: `${Number(landSize) * 20} kg`, purpose: "Root establishment and flowering" },
    { name: "Potassium (K2O)", quantity: `${Number(landSize) * 18} kg`, purpose: "Stress tolerance and grain/fruit quality" },
  ],
  schedule: [
    `Apply basal dose before sowing ${crop} in ${season}.`,
    "Apply half nitrogen after 25-30 days with light irrigation.",
    "Apply remaining nitrogen before flowering or active tillering.",
  ],
  warnings: [
    `Validate dosage with a local soil test for ${soilType} soil.`,
    "Avoid fertilizer application before heavy rainfall.",
  ],
  summary: `Indicative fertilizer plan for ${crop} on ${landSize} acres of ${soilType} soil.`,
});

const normalizeGeminiText = (text, input) => {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    return { ...fallbackRecommendation(input), summary: text || fallbackRecommendation(input).summary };
  }
};

exports.aiRecommend = async (req, res) => {
  try {
    const { crop, soilType, season, landSize } = req.body;

    if (!crop || !soilType || !season || !landSize) {
      return res.status(400).json({ error: "Crop, soil type, season, and land area are required" });
    }

    const input = { crop, soilType, season, landSize };
    let aiResponse = fallbackRecommendation(input);

    if (process.env.GEMINI_API_KEY) {
      const prompt = `
You are an agriculture fertilizer advisor for Indian farmers.
Return only valid JSON with keys: fertilizers (array of objects with name, quantity, purpose), schedule (array of strings), warnings (array of strings), summary (string).
Crop: ${crop}
Soil type: ${soilType}
Season: ${season}
Land area: ${landSize} acres
`;

      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
          { contents: [{ parts: [{ text: prompt }] }] },
          { timeout: 20000 }
        );

        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        aiResponse = normalizeGeminiText(text, input);
      } catch (geminiError) {
        console.warn("Gemini unavailable, using local fallback:", geminiError.response?.status || geminiError.message);
        aiResponse = {
          ...fallbackRecommendation(input),
          warnings: [
            ...fallbackRecommendation(input).warnings,
            "AI service is currently unavailable or the Gemini key/model is invalid, so this plan uses the local recommendation fallback.",
          ],
        };
      }
    }

    const plan = await Fertilizer.create({
      userId: req.user._id,
      landSize,
      crop,
      soilType,
      season,
      aiResponse,
    });

    res.status(201).json({ message: "Fertilizer plan generated", plan });
  } catch (error) {
    console.error("AI fertilizer error:", error.message);
    res.status(500).json({ error: "Unable to generate fertilizer recommendation" });
  }
};

exports.getMyPlans = async (req, res) => {
  try {
    const plans = await Fertilizer.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch fertilizer history" });
  }
};

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Fertilizer.find().populate("userId", "name phone role").sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch fertilizer plans" });
  }
};
