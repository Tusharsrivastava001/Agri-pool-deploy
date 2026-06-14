const express = require("express");
const weatherController = require("../controllers/weatherController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/", verifyToken, weatherController.getWeather);

module.exports = router;
