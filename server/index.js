require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const passport = require("passport");
require("./config/passport");
const authRoutes = require("./routes/auth");
const oauthRoutes = require("./routes/oauth");
const contactRoutes = require('./routes/contact');
const app = express();
const transportRoutes = require('./routes/transport');
const fertilizerRoutes = require("./routes/fertilizer");
const weatherRoutes = require("./routes/weather");
const mandiRoutes = require("./routes/mandi");
const adminRoutes = require("./routes/admin");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://agri-pool-deploy-six.vercel.app'
    ],
    methods: ["GET", "POST", "PUT"],
    credentials: true
  },
});

io.on("connection", (socket) => {
  socket.on("join_user", (userId) => {
    if (userId) {
      socket.join(`user:${userId}`);
    }
  });

  socket.on("join_transporters", () => {
    socket.join("transporters");
  });
});

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://agri-pool-deploy-six.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());
app.use((req, res, next) => {
  req.io = io;
  next();
});

// test route
app.get("/", (req, res) => {
  res.json({ message: "AgriPool backend is running..." });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/oauth", oauthRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/transport', transportRoutes);
app.use("/api/fertilizer", fertilizerRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/mandi", mandiRoutes);
app.use("/api/admin", adminRoutes);
// connect to mongodb


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB Error =>", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
