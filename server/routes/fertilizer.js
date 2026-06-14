const express = require("express");
const fertilizerController = require("../controllers/fertilizerController");
const { verifyToken, checkRole } = require("../middleware/auth");
const router = express.Router();

router.post("/ai-recommend", verifyToken, checkRole("farmer"), fertilizerController.aiRecommend);
router.get("/my-plans", verifyToken, checkRole("farmer"), fertilizerController.getMyPlans);
router.get("/all", verifyToken, checkRole("admin"), fertilizerController.getAllPlans);

module.exports = router;
