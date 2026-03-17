require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

// ── Connect to MongoDB ─────────────────────────
connectDB();

const app = express();

// ── Middleware ─────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));
app.use(express.json()); // Parse JSON request bodies
app.use(morgan("dev"));  // HTTP request logger

// ── Routes ─────────────────────────────────────
app.use("/api/tasks", taskRoutes);

// ── Health Check ───────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskManager API is running",
    timestamp: new Date().toISOString(),
  });
});

// ── 404 Handler ────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Centralized Error Handler ──────────────────
app.use(errorHandler);

// ── Start Server ───────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});