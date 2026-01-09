const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const uploadRoutes = require("./routes/upload.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// middleware
app.use(express.json());

// static folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../public")));

// database
mongoose
  .connect("mongodb://127.0.0.1:27017/file_upload_db")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use(express.static(path.join(__dirname, "../public")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

// server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
