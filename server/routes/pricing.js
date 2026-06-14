const express = require("express");
const router = express.Router();
const pricingController = require("../controllers/pricingController");

// Calculate estimated transport price
router.post("/estimate", pricingController.estimatePrice);

module.exports = router;
