const express = require("express");
const multer = require("multer");

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

// Store image temporarily in memory.
// Cloudinary will store the permanent image.
const storage = multer.memoryStorage();

// Allow JPG, PNG and WebP images only.
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

// Specific routes before dynamic routes

// Get all items
router.get("/", getItems);

// Get logged-in user's items
router.get("/my-items", protect, getMyItems);

// Create item with Cloudinary image upload
router.post("/", protect, upload.single("image"), createItem);

// Update item status
router.patch("/:id/status", protect, updateItemStatus);

// Delete item
router.delete("/:id", protect, deleteItem);

// Get single item
router.get("/:id", getItemById);

module.exports = router;