require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const uploadRoutes = require("./routes/upload.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// Middleware
app.use(express.json());

// Serve uploads folder (OUTSIDE src)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Serve frontend (public folder)
app.use(express.static(path.join(__dirname, "../public")));

// Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);

// 🔥 Root route → Serve login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login_register.html"));
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

