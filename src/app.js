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

// Database (use env variable)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Cloud Media Service API Running");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
