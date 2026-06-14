const express = require("express");
const adminController = require("../controllers/adminController");
const { verifyToken, checkRole } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken, checkRole("admin"));

router.get("/stats", adminController.getStats);
router.get("/users", adminController.getUsers);
router.get("/contacts", adminController.getContacts);

module.exports = router;
