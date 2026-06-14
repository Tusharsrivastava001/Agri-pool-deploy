const express = require("express");
const transportController = require("../controllers/transportController");
const { verifyToken, checkRole } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");
const router = express.Router();

const uploadCropPhoto = (req, res, next) => {
  upload.single("cropPhoto")(req, res, (error) => {
    if (error) {
      return res.status(400).json({ error: error.message || "Unable to upload crop photo" });
    }
    next();
  });
};

router.post("/request", verifyToken, checkRole("farmer"), uploadCropPhoto, transportController.createRequest);
router.get("/open", verifyToken, checkRole("transporter"), transportController.getOpenRequests);
router.get("/my-requests", verifyToken, checkRole("farmer"), transportController.getMyRequests);
router.get("/assigned", verifyToken, checkRole("transporter"), transportController.getAssignedRequests);
router.put("/:id/accept", verifyToken, checkRole("transporter"), transportController.acceptRequest);
router.put("/:id/status", verifyToken, checkRole("transporter"), transportController.updateStatus);
router.put("/:id/cancel", verifyToken, checkRole("farmer"), transportController.cancelRequest);

module.exports = router;
