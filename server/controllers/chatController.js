const Message = require("../models/message");
const User = require("../models/user");

// Get conversation between two users
exports.getMessages = async (req, res) => {
    try {
        const { userId } = req.params; // ID of the person we are chatting with
        const currentUserId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: userId },
                { sender: userId, receiver: currentUserId },
            ],
        }).sort({ createdAt: 1 }); // Oldest first to match typical chat UI behavior

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Server error while fetching messages" });
    }
};

// Get list of previous chat contacts
exports.getConversations = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // Find all distinct users we have exchanged messages with
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { receiver: currentUserId }],
        })
            .sort({ createdAt: -1 })
            .populate("sender", "name profilePicture role")
            .populate("receiver", "name profilePicture role");

        // Extract unique contacts and the last message
        const conversationsMap = new Map();

        messages.forEach((msg) => {
            const otherUser =
                msg.sender._id.toString() === currentUserId
                    ? msg.receiver
                    : msg.sender;

            if (!conversationsMap.has(otherUser._id.toString())) {
                conversationsMap.set(otherUser._id.toString(), {
                    contact: otherUser,
                    lastMessage: msg,
                    unreadCount:
                        msg.receiver._id.toString() === currentUserId && !msg.read ? 1 : 0,
                });
            } else {
                if (msg.receiver._id.toString() === currentUserId && !msg.read) {
                    conversationsMap.get(otherUser._id.toString()).unreadCount += 1;
                }
            }
        });

        const conversations = Array.from(conversationsMap.values());
        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ error: "Server error while fetching conversations" });
    }
};

// Mark messages from a specific user as read
exports.markAsRead = async (req, res) => {
    try {
        const { senderId } = req.body;
        const currentUserId = req.user.id;

        await Message.updateMany(
            { sender: senderId, receiver: currentUserId, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Server error marking messages as read" });
    }
};
