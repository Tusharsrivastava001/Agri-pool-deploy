const User = require("../models/user");
const TransportRequest = require("../models/TransportRequest");
const Fertilizer = require("../models/fertilizer");
const Contact = require("../models/Contact");

exports.getStats = async (req, res) => {
  try {
    const [farmers, transporters, admins, fertilizerQueries] = await Promise.all([
      User.countDocuments({ role: "farmer" }),
      User.countDocuments({ role: "transporter" }),
      User.countDocuments({ role: "admin" }),
      Fertilizer.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }),
    ]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const requestsByDay = await TransportRequest.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topCrops = await TransportRequest.aggregate([
      { $group: { _id: "$cropName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      usersByRole: [
        { role: "farmers", count: farmers },
        { role: "transporters", count: transporters },
        { role: "admins", count: admins },
      ],
      requestsByDay: requestsByDay.map((item) => ({ date: item._id, count: item.count })),
      topCrops: topCrops.map((item) => ({ crop: item._id, count: item.count })),
      fertilizerQueriesThisMonth: fertilizerQueries,
    });
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch admin stats" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch users" });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(20);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch contacts" });
  }
};
