const TransportRequest = require("../models/TransportRequest");

exports.createRequest = async (req, res) => {
    try {
        const { cropName, quantity, pickupLocation, destination, date } = req.body;

        if (!cropName || !quantity || !pickupLocation || !destination || !date) {
            return res.status(400).json({ error: "All transport request fields are required" });
        }

        const newRequest = new TransportRequest({
            userId: req.user._id,
            cropName,
            quantity,
            pickupLocation,
            destination,
            date,
            cropPhotoUrl: req.file?.path || "",
        });

        await newRequest.save();
        await newRequest.populate("userId", "name phone role");

        if (req.io) {
            req.io.to("transporters").emit("new_request", newRequest);
        }

        res.status(201).json({
            message: "Transport request saved successfully",
            request: newRequest,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getOpenRequests = async (req, res) => {
    try {
        const requests = await TransportRequest.find({ status: "Pending" })
            .populate('userId', 'name phone')
            .sort({ createdAt: -1 })
            .exec();

        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.acceptRequest = async (req, res) => {
    try {
        const request = await TransportRequest.findOneAndUpdate(
            { _id: req.params.id, status: "Pending" },
            { status: "Accepted", transporterId: req.user._id },
            { new: true }
        ).populate("userId", "name phone").populate("transporterId", "name phone");

        if (!request) {
            return res.status(404).json({ error: "Pending request not found" });
        }

        if (req.io) {
            req.io.to(`user:${request.userId._id}`).emit("request_accepted", request);
        }

        res.json({ message: "Request accepted", request });
    } catch (error) {
        res.status(500).json({ error: "Unable to accept request" });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ["In Transit", "Delivered"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status update" });
        }

        const request = await TransportRequest.findOneAndUpdate(
            { _id: req.params.id, transporterId: req.user._id },
            { status },
            { new: true }
        ).populate("userId", "name phone").populate("transporterId", "name phone");

        if (!request) {
            return res.status(404).json({ error: "Assigned request not found" });
        }

        if (req.io) {
            req.io.to(`user:${request.userId._id}`).emit("status_update", request);
        }

        res.json({ message: "Status updated", request });
    } catch (error) {
        res.status(500).json({ error: "Unable to update request status" });
    }
};

exports.getMyRequests = async (req, res) => {
    try {
        const requests = await TransportRequest.find({ userId: req.user._id })
            .populate("transporterId", "name phone")
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch your bookings" });
    }
};

exports.cancelRequest = async (req, res) => {
    try {
        const request = await TransportRequest.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id, status: "Pending" },
            { status: "Cancelled" },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ error: "Pending request not found" });
        }

        res.json({ message: "Request cancelled", request });
    } catch (error) {
        res.status(500).json({ error: "Unable to cancel request" });
    }
};

exports.getAssignedRequests = async (req, res) => {
    try {
        const requests = await TransportRequest.find({ transporterId: req.user._id })
            .populate("userId", "name phone")
            .sort({ updatedAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch assigned requests" });
    }
};
