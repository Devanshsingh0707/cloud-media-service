const multer = require("multer");
const path = require("path");

// allowed file types
const allowedTypes = /jpeg|jpg|png|webp/;

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// file filter (type validation)
const fileFilter = (req, file, cb) => {
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpg, png, webp)"));
  }
};

// multer instance
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB
  },
  fileFilter,
});

module.exports = upload;
