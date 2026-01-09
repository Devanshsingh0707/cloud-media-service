const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.middleware");
const auth = require("../middlewares/auth.middleware");
const {
  uploadFile,
  getUploads,
  deleteUpload,
} = require("../controllers/upload.controller");

// UPLOAD (WITH VALIDATION + AUTH)
router.post("/upload", auth, (req, res) => {
  upload.single("file")(req, res, err => {
    if (err) {
      return res.status(400).json({
        message: err.message || "File upload error",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file selected",
      });
    }

    uploadFile(req, res);
  });
});

// GET USER UPLOADS
router.get("/uploads", auth, getUploads);

// DELETE USER UPLOAD
router.delete("/uploads/:id", auth, deleteUpload);

module.exports = router;
