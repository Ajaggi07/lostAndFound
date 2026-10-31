
const router = require("express").Router();

const {
    register,
    login,
    getMe
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Current logged-in user
router.get("/me", protect, getMe);

module.exports = router;
