const express = require("express");
const mandiController = require("../controllers/mandiController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/", verifyToken, mandiController.getPrices);

module.exports = router;
