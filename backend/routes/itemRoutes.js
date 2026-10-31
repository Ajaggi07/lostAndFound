const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  createItem,
  getItems,
  getItemById,
  getMyItems,
  updateItemStatus,
  deleteItem,
} = require("../controllers/itemController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// Allow image files only
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG and WebP images are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// IMPORTANT: Specific routes must come before /:id

// Get all items
router.get("/", getItems);

// Get items reported by the logged-in user
router.get("/my-items", protect, getMyItems);

// Create a new item
router.post("/", protect, upload.single("image"), createItem);

// Update item status
router.patch("/:id/status", protect, updateItemStatus);

// Delete an item
router.delete("/:id", protect, deleteItem);

// Get a single item by ID
// Keep this dynamic route after specific routes
router.get("/:id", getItemById);

module.exports = router;