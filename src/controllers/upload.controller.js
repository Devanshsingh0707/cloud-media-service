const fs = require("fs");
const path = require("path");
const File = require("../models/file.model");

// =====================
// UPLOAD FILE
// =====================
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = await File.create({
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      user: req.userId, // ✅ THIS FIXES THE 500
    });

    res.status(201).json({
      message: "Upload successful",
      file,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err); // 🔍 DEBUG
    res.status(500).json({ message: "Upload failed" });
  }
};

// =====================
// GET USER UPLOADS ONLY
// =====================
exports.getUploads = async (req, res) => {
  const files = await File.find({ user: req.userId }).sort({
    createdAt: -1,
  });

  res.json(files);
};

// =====================
// DELETE USER FILE ONLY
// =====================
exports.deleteUpload = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      user: req.userId, // 🔐 ownership check
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, "..", file.path);
    fs.unlink(filePath, () => {});

    await file.deleteOne();
    res.json({ message: "File deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
