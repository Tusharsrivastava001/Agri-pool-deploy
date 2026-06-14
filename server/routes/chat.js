const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const passport = require("passport");

// Protect all chat routes with JWT
router.use(passport.authenticate("jwt", { session: false }));

// Fetch conversations list
router.get("/conversations", chatController.getConversations);

// Fetch messages with a specific user
router.get("/:userId", chatController.getMessages);

// Mark messages from a user as read
router.post("/read", chatController.markAsRead);

module.exports = router;
