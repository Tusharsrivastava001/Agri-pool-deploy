const Contact = require('../models/Contact');

exports.submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // 1. Basic Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }

        // 2. Create New Entry
        const newContact = new Contact({
            name,
            email,
            subject,
            message
        });

        // 3. Save to MongoDB
        await newContact.save();

        res.status(201).json({
            success: true,
            message: "Message stored successfully in AgriPool database!"
        });

    } catch (error) {
        console.error("Backend Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error. Please try again later."
        });
    }
};
