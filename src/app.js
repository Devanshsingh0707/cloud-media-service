require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const uploadRoutes = require("./routes/upload.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());

// ================= STATIC FILES =================

// 🔥 Serve uploads folder (INSIDE src)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔥 Serve frontend (public folder at root level)
app.use(express.static(path.join(__dirname, "../public")));

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ================= API ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);

// ================= ROOT ROUTE =================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login_register.html"));
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
