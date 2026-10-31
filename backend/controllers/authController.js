
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Remove sensitive information before sending user data
const safeUser = (user) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };
};

// REGISTER
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please fill in all required fields."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must contain at least 6 characters."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password
        });

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: safeUser(user)
        });

    } catch (error) {
        next(error);
    }
};

// LOGIN
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email: String(email || "").trim().toLowerCase()
        }).select("+password");

        if (
            !user ||
            !password ||
            !(await user.matchPassword(password))
        ) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        res.status(200).json({
            success: true,
            token: generateToken(user._id),
            user: safeUser(user)
        });

    } catch (error) {
        next(error);
    }
};

// GET LOGGED-IN USER
exports.getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        user: safeUser(req.user)
    });
};
