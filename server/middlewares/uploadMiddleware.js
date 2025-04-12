const multer = require("multer");
const path = require("path");

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + ext;
    cb(null, uniqueName);
  },
});

// Set up file size limit and file type filter
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit to 5MB per file
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

// Middleware to handle the image upload
const uploadSingleImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      // Handle multer errors (e.g., file too large, wrong file type)
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

module.exports = { uploadSingleImage };
    