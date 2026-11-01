
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const claimRoutes = require("./routes/claimRoutes");

const {
    notFound,
    errorHandler
} = require("./middleware/errorMiddleware");

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Campus Lost & Found API is running."
    });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/claims", claimRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
